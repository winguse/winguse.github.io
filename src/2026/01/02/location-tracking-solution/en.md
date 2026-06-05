---
title: "Changed Location Timeline Tool"
date: 2026-01-02 21:05:00 -0800
---

Unnoticeably, time has already slipped into the second day of 2026. I wanted to write something so that 2025 wouldn't end up without a single article, but alas, I'm lazy.
Recently on holiday at home, I've basically done nothing except tinker with various things, but I haven't even gotten around to redoing the waterproof sealant in the kitchen.
Here's just a summary of my recent journey of tinkering with tools to save my history logs.

At the very beginning, I used Google's Timeline History, which I recall started in 2010. In 2025, this service officially entered Google's graveyard.
I went to export the data once, but unfortunately, before I executed the export, it had already expired my data from the 2010s, so basically nothing was exported.
In 2015, I started using Moves. Later, this app was acquired by Facebook, and in 2018, it also entered Facebook's graveyard.
After tinkering around in 2018, I started using Arc and continued until recently when I switched to Overland.

Arc's data is stored on iCloud. Initially, I was somewhat critical of its requirement to download a model based on my location to identify various types of activities.
But in reality, I didn't care about this identification at all (Moves had it too, and I didn't care then either).
As data accumulated, I encountered issues exporting data multiple times when changing phones.
I always had auto-export of Daily and Monthly GPX and JSON data enabled; even so, it still caused me to lose quite a bit of data. My partner's phone had the same issue.
Arc is a paid app; since I used it, I paid $100 for a lifetime unlock. However, it feels like the app hasn't been very active in updates or bug fixes lately.
Arc also open-sourced its core code once, turning it into Arc Mini, but it seems to have been delisted now. The core code used its own Location library when it was open-sourced, which means it still required downloading its model.
On a "good enough" level, the app is decent, but it clearly doesn't handle large amounts of data management well, and this problem feels like it's snowballing.

In the winter of 2024, I started thinking about a different approach. So I used PostgreSQL to import all Arc data and used Grafana for data visualization; I actually thought it was quite good.
This winter, I saw a [post](https://dabr.ca/notice/B1YPr3scGjZMCQYdYO) mentioning a tool called Reitti, and thus began this new round of tinkering.
Reitti requires PostGIS, but it doesn't have a Docker ARM64 image, so I initially gave up. But thinking that I was on holiday and had nothing better to do, I decided to mess with it.
I installed Ubuntu on my only low-power x86 device—a Mi Pad 2 (it took a *really* long time), then ran it to play around, imported some data, and felt the visualization was quite well done.
At the same time, I also installed a complete OwnTracks solution and played with it throughout the holiday.

Let's talk about the solution I ended up keeping.
I'm currently using the Overland app on my phone, sending data to a server-side written in Deno. The server-side does the following:

1. Writes requests to disk, keeping raw data (learning from OwnTracks Recorder).
2. Writes to a PostgreSQL data table I created (continuing to use Grafana).
3. Finally forwards the requests intact to Reitti.

OwnTracks actually has its own app, and the server-side is written in C. The entire system design is very restrained, aiming to be like Apple's "Find My," allowing real-time location sharing with friends.
The "restraint" mentioned here is, on one hand, functional simplicity (and thus reliability), and on the other hand, extremely low server-side resource usage.
It initially only supported the MQTT protocol, with HTTP added later. MQTT also uses mTLS authentication, which I found commendable.
However, my personal least favorite part is precisely MQTT. It's a persistent connection, which might make the client more power-hungry than other solutions.
And HTTP mode doesn't seem to support batching, so some people complain about high data consumption.
The server-side philosophy is to preserve data as much as possible, basically writing all received requests as text files. Visualization-wise, it provides a very basic HTML page by default, and there's also a Vue version, but they are only at the "viewable" level, far inferior to the Grafana Dashboards I made.
So I don't plan to use it long-term. But the server-side is indeed very resource-efficient, so I've kept it to see if there will be further developments. Though maybe not; the project is 10 years old, and while still maintained, it's overall very stable and fixed.

Reitti is written in Java and has very high memory consumption, especially during data import and processing. However, it puts a lot of effort into visualization, generating annual and monthly analyses, such as how long was spent in a certain place and what mode of transport was used (judged based on speed).
Its design places high importance on privacy: when converting coordinates to place names, you can download OpenStreetMap offline data for local queries instead of calling external APIs (though to be honest, I took the easy way out and didn't do that).
Reitti only stores 3D coordinate information, and the visualization part only uses 2D data; information like speed isn't saved. So I also don't quite like that it loses so much data (though practically it's not that useful anyway).
Data export is currently quite rudimentary; the export interface will freeze if you select a slightly longer time range. Of course, since it's self-deployed, writing some code to export isn't difficult.
Considering all this, I'm currently just treating it as a visualization UI and not expecting more.
Because I ultimately had to use Reitti, I tinkered for a while to install the database directly outside of Docker. During data import, Reitti even crashed the database process once, but it was manageable after a restart.

Finally, let's talk about the security of the current setup.
Strictly speaking, data security might not be better than Arc. Overland could be killed by iOS, leading to data not being recorded; my home server only backs up every two days—if it doesn't backup in time, data will be lost; the server's own availability isn't high either.
However, Overland saves data locally on the phone first and only deletes it once the server confirms receipt, so it might not be a big issue.
I'm still hoping Overland can support (or another app can support) long-term local storage on the phone.

After writing so much, I'll finally post the code I used, in case anyone finds it useful.
MIT License, I won't put it on GitHub; most of it was written by GPT—I'm really lazy...

```typescript
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// Type definitions
interface ValidationRule {
  userId: number;
  queries?: Record<string, string[]>;
  headers?: Record<string, string[]>;
}

interface DatabaseConfig {
  hostname: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

interface Config {
  port: number;
  validationRules: ValidationRule[];
  database: DatabaseConfig;
  fileStoragePath: string;
  upstreamUri: string;
}

interface LocationProperties {
  timestamp: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  speed?: number;
  horizontal_accuracy?: number;
  vertical_accuracy?: number;
  course?: number;
  course_accuracy?: number;
  speed_accuracy?: number;
  motion?: string[];
  battery_state?: string;
  battery_level?: number;
  wifi?: string;
  pauses?: boolean;
  activity?: string;
  desired_accuracy?: number;
  deferred?: number;
  significant_change?: string;
  locations_in_payload?: number;
  device_id?: string;
  // Trip-related fields
  start?: string;
  end?: string;
  type?: string;
  mode?: string;
  distance?: number;
  duration?: number;
  steps?: number;
  stopped_automatically?: boolean;
  start_location?: Location | null;
  end_location?: Location;
}

interface PointGeometry {
  type: "Point";
  coordinates: [number, number];
}

interface Location {
  type: "Feature";
  geometry?: PointGeometry;
  properties: LocationProperties;
}

interface ApiRequest {
  locations: Location[];
  current?: unknown;
  trip?: unknown;
}

interface DbLocationData {
  user_id: number;
  ts: Date;
  latitude: number;
  longitude: number;
  horizontal_accuracy: number | null;
  altitude: number | null;
  vertical_accuracy: number | null;
  course: number | null;
  course_accuracy: number | null;
  speed: number | null;
  speed_accuracy: number | null;
  battery_state: string | null;
  battery_level: number | null;
  motions: string[] | null;
  wifi: string | null;
}

// Global configuration
const CONFIG: Config = {
  port: parseInt(Deno.env.get("SERVER_PORT") || "8080"),
  validationRules: [
    {
      userId: 1,
      queries: { token: ["user 1 token"] },
      // headers: { headerName: ["validValue3"] },
    },
    {
      userId: 2,
      queries: { token: ["user 2 token"] },
      // headers: { headerName: ["validValue3"] },
    },
    // Add more rules as needed
  ],
  database: {
    hostname: Deno.env.get("DB_HOSTNAME") || "localhost",
    port: parseInt(Deno.env.get("DB_PORT") || "5432"),
    database: Deno.env.get("DB_NAME") || "location_history",
    user: Deno.env.get("DB_USER") || "postgres",
    password: Deno.env.get("DB_PASSWORD") || "",
  },
  fileStoragePath: "/app/data",
  upstreamUri: "http://reitti-server-address:8080/api/v1/ingest/overland",
};

// Database client
let dbClient: Client | null = null;

// Initialize database connection
async function initDatabase() {
  dbClient = new Client(CONFIG.database);
  await dbClient.connect();
  console.log("Database connected");
}

// Validate request against rules
function validateRequest(
  url: URL,
  headers: Headers,
): { valid: boolean; userId?: number } {
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const headerMap = Object.fromEntries(headers.entries());

  for (const rule of CONFIG.validationRules) {
    let matches = true;

    // Check queries
    if (rule.queries) {
      for (const [key, validValues] of Object.entries(rule.queries)) {
        const value = queryParams[key];
        if (!value || !validValues.includes(value)) {
          matches = false;
          break;
        }
      }
    }

    // Check headers
    if (matches && rule.headers) {
      for (const [key, validValues] of Object.entries(rule.headers)) {
        const value = headerMap[key.toLowerCase()];
        if (!value || !validValues.includes(value)) {
          matches = false;
          break;
        }
      }
    }

    if (matches) {
      return { valid: true, userId: rule.userId };
    }
  }

  return { valid: false };
}

// Validate location data
function validateLocation(location: Location): {
  valid: boolean;
  error?: string;
} {
  if (!location.properties) {
    return { valid: false, error: "Missing properties" };
  }

  const props = location.properties;
  
  // For trip records, timestamp might be in 'end' field, or use 'timestamp'
  const hasTimestamp = props.timestamp || props.end || props.start;
  if (!hasTimestamp) {
    return { valid: false, error: "Missing timestamp" };
  }

  // Check for coordinates in geometry.coordinates or properties
  const coords = location.geometry?.coordinates || [];
  const hasCoordsInGeometry = coords.length >= 2 && 
    coords[0] !== undefined && coords[0] !== null &&
    coords[1] !== undefined && coords[1] !== null;
  const hasCoordsInProps = props.latitude !== undefined && props.latitude !== null &&
    props.longitude !== undefined && props.longitude !== null;

  if (!hasCoordsInGeometry && !hasCoordsInProps) {
    return { valid: false, error: "Missing latitude/longitude" };
  }

  return { valid: true };
}

// Convert location to database format
function locationToDbFormat(location: Location, userId: number): DbLocationData {
  const props = location.properties;
  const coords = location.geometry?.coordinates || [];

  // Use timestamp, end, or start (in that order of preference)
  const timestampStr = props.timestamp || props.end || props.start;
  if (!timestampStr) {
    throw new Error("No timestamp available");
  }
  const timestamp = new Date(timestampStr);
  const latitude = coords[1] ?? props.latitude;
  const longitude = coords[0] ?? props.longitude;

  // Enum values from schema
  const validMotionTypes = [
    "driving",
    "walking",
    "running",
    "cycling",
    "stationary",
    "automotive_navigation",
    "fitness",
    "other_navigation",
    "other",
    "moving",
    "uncertain",
  ];
  const validBatteryStates = ["unknown", "charging", "full", "unplugged"];

  // Process motion array
  let motions: string[] | null = null;
  if (Array.isArray(props.motion)) {
    motions = props.motion.filter((m) =>
      validMotionTypes.includes(m)
    );
    if (motions.length === 0) {
      motions = null;
    }
  }

  // Process battery_state
  let batteryState: string | null = props.battery_state || null;
  if (batteryState && !validBatteryStates.includes(batteryState)) {
    batteryState = null;
  }

  return {
    user_id: userId,
    ts: timestamp,
    latitude: latitude!,
    longitude: longitude!,
    horizontal_accuracy: props.horizontal_accuracy ?? null,
    altitude: props.altitude ?? null,
    vertical_accuracy: props.vertical_accuracy ?? null,
    course: props.course ?? null,
    course_accuracy: props.course_accuracy ?? null,
    speed: props.speed ?? null,
    speed_accuracy: props.speed_accuracy ?? null,
    battery_state: batteryState,
    battery_level: props.battery_level ?? null,
    motions: motions,
    wifi: props.wifi || null,
  };
}

// Insert a single location into database
async function insertSingleLocation(location: Location, userId: number) {
  if (!dbClient) {
    throw new Error("Database not connected");
  }

  const validation = validateLocation(location);
  if (!validation.valid) {
    console.warn(`Skipping invalid location: ${validation.error}`);
    return;
  }

  const dbData = locationToDbFormat(location, userId);

  await dbClient.queryObject`
    INSERT INTO public.positions (
      user_id, ts, geom, horizontal_accuracy,
      altitude, vertical_accuracy, course, course_accuracy,
      speed, speed_accuracy, battery_state, battery_level,
      motions, wifi
    ) VALUES (
      ${dbData.user_id}, ${dbData.ts},
      ST_SetSRID(ST_MakePoint(${dbData.longitude}, ${dbData.latitude}), 4326),
      ${dbData.horizontal_accuracy}, ${dbData.altitude}, ${dbData.vertical_accuracy},
      ${dbData.course}, ${dbData.course_accuracy}, ${dbData.speed},
      ${dbData.speed_accuracy}, ${dbData.battery_state}, ${dbData.battery_level},
      ${dbData.motions}, ${dbData.wifi}
    )
    ON CONFLICT (ts, user_id, geom) DO UPDATE SET
      horizontal_accuracy = EXCLUDED.horizontal_accuracy,
      altitude = EXCLUDED.altitude,
      vertical_accuracy = EXCLUDED.vertical_accuracy,
      course = EXCLUDED.course,
      course_accuracy = EXCLUDED.course_accuracy,
      speed = EXCLUDED.speed,
      speed_accuracy = EXCLUDED.speed_accuracy,
      battery_state = EXCLUDED.battery_state,
      battery_level = EXCLUDED.battery_level,
      motions = EXCLUDED.motions,
      wifi = EXCLUDED.wifi
  `;
}

// Extract all locations from a location object, including nested ones
function extractAllLocations(location: Location): Location[] {
  const result: Location[] = [];
  const props = location.properties;

  // Extract start_location if it exists
  if (props.start_location) {
    result.push(props.start_location);
  }

  // Extract the main location if it has valid coordinates
  if (location.geometry?.coordinates || props.latitude !== undefined) {
    result.push(location);
  }

  // Extract end_location if it exists
  if (props.end_location) {
    result.push(props.end_location);
  }

  return result;
}

// Insert locations into database
async function insertLocations(locations: Location[], userId: number) {
  if (!dbClient) {
    throw new Error("Database not connected");
  }

  // Extract all locations (including nested ones) into a flat list
  const allLocations: Location[] = [];
  for (const location of locations) {
    const extracted = extractAllLocations(location);
    allLocations.push(...extracted);
  }

  // Insert each location individually as a separate record
  for (const location of allLocations) {
    await insertSingleLocation(location, userId);
  }
}

// Write JSON to disk
async function writeToDisk(jsonData: ApiRequest, userId: number) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");

  const dirPath = `${CONFIG.fileStoragePath}/${year}/${month}`;
  await Deno.mkdir(dirPath, { recursive: true });

  const filePath = `${dirPath}/${day}.rec`;
  const jsonStr = JSON.stringify(jsonData);
  const line = `${userId} ${jsonStr}\n`;

  await Deno.writeTextFile(filePath, line, { append: true });
}

// Forward request to upstream
async function forwardRequest(
  originalRequest: Request,
  jsonData: ApiRequest,
): Promise<Response> {
  const upstreamUrl = new URL(CONFIG.upstreamUri);

  // Copy query parameters
  const originalUrl = new URL(originalRequest.url);
  for (const [key, value] of originalUrl.searchParams.entries()) {
    upstreamUrl.searchParams.set(key, value);
  }

  // Copy headers
  const headers = new Headers();
  for (const [key, value] of originalRequest.headers.entries()) {
    headers.set(key, value);
  }
  // Ensure Content-Type is set for JSON
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Forward request
  const response = await fetch(upstreamUrl.toString(), {
    method: "POST",
    headers: headers,
    body: JSON.stringify(jsonData),
  });

  return response;
}

// Handle API request
async function handleApiRequest(request: Request): Promise<Response> {
  try {
    // Validate request
    const url = new URL(request.url);
    const validation = validateRequest(url, request.headers);

    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: "Validation failed" }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }

    const userId = validation.userId!;

    // Parse JSON
    let jsonData: ApiRequest;
    try {
      jsonData = await request.json() as ApiRequest;
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON", details: String(error) }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Validate locations array exists
    if (!jsonData.locations || !Array.isArray(jsonData.locations)) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid locations array" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // always forward first
    const fwRequested = forwardRequest(request, jsonData);

    // Write to disk
    try {
      await writeToDisk(jsonData, userId);
    } catch (error) {
      console.error("File write error:", error);
      return new Response(
        JSON.stringify({ error: "Write file error", details: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Write to database
    try {
      await insertLocations(jsonData.locations, userId);
    } catch (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Database error", details: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Wait Forward to upstream
    try {
      const upstreamResponse = await fwRequested;
      return upstreamResponse;
    } catch (error) {
      console.error("Upstream forward error:", error);
      // Return success even if upstream fails
      return new Response(
        JSON.stringify({ success: true, message: "Processed but upstream failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

// Forward reprocessed data to upstream (no original Request available)
async function forwardReprocessRequest(
  jsonData: ApiRequest,
  userId: number,
): Promise<Response> {
  const upstreamUrl = new URL(CONFIG.upstreamUri);

  // Re-apply validation rule query params (e.g. token)
  const rule = CONFIG.validationRules.find(r => r.userId === userId);
  if (rule?.queries) {
    for (const [key, values] of Object.entries(rule.queries)) {
      if (values.length > 0) {
        upstreamUrl.searchParams.set(key, values[0]);
      }
    }
  }

  return await fetch(upstreamUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  });
}



// Reprocess data from rec file for a given date
async function handleReprocessRequest(request: Request, dateStr: string): Promise<Response> {
  try {

    // Parse date (expecting YYYY-MM-DD format)
    let date: Date;
    try {
      date = new Date(dateStr + "T00:00:00Z");
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid date format. Expected YYYY-MM-DD", details: String(error) }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    const filePath = `${CONFIG.fileStoragePath}/${year}/${month}/${day}.rec`;

    // Check if file exists
    try {
      await Deno.stat(filePath);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "File not found", path: filePath }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Read and process file
    const fileContent = await Deno.readTextFile(filePath);
    const lines = fileContent.trim().split("\n").filter(line => line.trim().length > 0);

    let processedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    const userCounts: Record<number, number> = {};

    for (const line of lines) {
      try {
        // Parse format: {user_id} {json}
        const spaceIndex = line.indexOf(" ");
        if (spaceIndex === -1) {
          errorCount++;
          errors.push(`Invalid line format (missing space): ${line.substring(0, 50)}`);
          continue;
        }

        const userIdStr = line.substring(0, spaceIndex);
        const userId = parseInt(userIdStr, 10);
        
        if (isNaN(userId) || userId <= 0) {
          errorCount++;
          errors.push(`Invalid user_id: ${userIdStr}`);
          continue;
        }

        const jsonStr = line.substring(spaceIndex + 1);
        const jsonData = JSON.parse(jsonStr) as ApiRequest;
        
        if (!jsonData.locations || !Array.isArray(jsonData.locations)) {
          errorCount++;
          errors.push(`Invalid locations array in line`);
          continue;
        }

      // Forward to upstream FIRST (same behavior as live ingest)
      try {
        const upstreamResp = await forwardReprocessRequest(jsonData, userId);
        if (!upstreamResp.ok) {
          throw new Error(`Upstream failed: ${upstreamResp.status}`);
        }
      } catch (error) {
        errorCount++;
        errors.push(`Upstream error for user ${userId}: ${String(error)}`);
        continue; // skip DB insert if upstream fails
      }

      // Then write to database
      await insertLocations(jsonData.locations, userId);

      processedCount++;
      userCounts[userId] = (userCounts[userId] || 0) + 1;

      } catch (error) {
        errorCount++;
        errors.push(`Error processing line: ${String(error)}`);
        console.error("Error processing line:", error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Reprocessing completed",
        date: dateStr,
        processed: processedCount,
        errors: errorCount,
        user_counts: userCounts,
        error_details: errors.length > 0 ? errors.slice(0, 10) : undefined, // Limit error details
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Reprocess error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

// Main server handler
async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/api/v1/ingest/overland" && request.method === "POST") {
    return await handleApiRequest(request);
  }

  // Handle reprocess endpoint: /api/v1/reprocess/YYYY-MM-DD
  if (url.pathname.startsWith("/api/v1/reprocess/") && request.method === "POST") {
    const dateStr = url.pathname.replace("/api/v1/reprocess/", "");
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return await handleReprocessRequest(request, dateStr);
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid date format in URL. Expected /api/v1/reprocess/YYYY-MM-DD" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  return new Response("Not Found", { status: 404 });
}

// Start server
async function main() {
  await initDatabase();

  console.log(`Server listening on port ${CONFIG.port}`);
  await serve(handler, { hostname: '0.0.0.0', port: CONFIG.port });
}

// Handle cleanup
Deno.addSignalListener("SIGINT", async () => {
  console.log("\nShutting down...");
  if (dbClient) {
    await dbClient.end();
  }
  Deno.exit(0);
});

if (import.meta.main) {
  main();
}
```

```sql run=false echo
CREATE TYPE public.battery_state_type AS ENUM
    ('unknown', 'charging', 'full', 'unplugged');

CREATE TYPE public.motion_type AS ENUM
    ('driving', 'walking', 'running', 'cycling', 'stationary', 'automotive_navigation', 'fitness', 'other_navigation', 'other', 'moving', 'uncertain');

CREATE TABLE IF NOT EXISTS public.positions
(
    user_id integer NOT NULL,
    ts timestamp without time zone NOT NULL,
    geom geometry(Point,4326) NOT NULL,
    horizontal_accuracy numeric(6,2),
    altitude numeric(7,2),
    vertical_accuracy numeric(5,2),
    course numeric(4,1),
    course_accuracy numeric(4,1),
    speed numeric(5,2),
    speed_accuracy numeric(4,1),
    battery_state battery_state_type,
    battery_level numeric(3,2),
    motions motion_type[],
    wifi text COLLATE pg_catalog."default",
    CONSTRAINT positions_pkey PRIMARY KEY (ts, user_id, geom)
);
```
