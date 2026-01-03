---
title: "换了位置时间线工具"
date: 2026-01-02 21:05:00 -0800
---

不知不觉，时间划入 2026 年已经第二天，本来想写点东西，让 2025 不至于又一篇文章都没有，可惜，我懒。
最近放假在家，基本啥也没干，折腾了一圈各种东西，可是就连厨房的防水胶我都还没去重新整。

这里仅此记录一下，折腾了一圈保存我历史记录的工具的小结吧。

最最开始我用的是 Google 的 Timeline history，印象中 2010 年开始吧，2025 年这个服务进入了 Google 的坟墓。
我去导出了一次数据，不过很可惜，在我执行导出之前，它已经吧我 2010 年代的数据 expire 了，所以我基本没倒出任何东西。
在 2015 年的时候，我开始使用 Moves，后来这个 App 被 Fackbook 收购，然后 2018 年就进了 Facebook 的坟墓。
2018 年着了一圈，我开始使用 Arc，一直用到了最近，然后换成了 Overland。

Arc 的数据是保存在 iCloud 上的，我一开始就比较诟病它需要根据我的位置，下载一个模型，用于识别我各种活动是什么类型的。
因为我根本不在乎这个识别（Moves 也有，我也不在乎）。然后随着数据积累变多，在我更换手机的时候，它也曾出现过好几次导出数据的问题。
我一直默认开启了导出 Daily 和 Monthly 的 GPX 和 JSON 数据，即便如此，它还是让我丢了好些数据。家里领导的手机也是一样的有问题。
Arc 是收费的，我觉得我用了它了，就给 100 刀，充了个永久解锁。不过感觉这个 App 最后好像更新改 Bug 都不怎么积极。Arc 也曾开源了
核心代码，做成了 Arc Mini，不过现在看下架了，核心代码开源还是用了做舍的那个 Location 库，也就是还是要下他的模型。
在凑合用的情况来说，这个 App 还不错吧，不过它显然对于大量数据管理确实做得不怎好，而且这个问题感觉有点滚雪球了。

2024 年的冬天，我就琢磨着换一个方法，所以我用 postgresql 倒入了所有的 Arc 的数据，用 Grafana 做数据可视化，其实我觉得挺不错的。
今年冬天，我看到了一个[帖子](https://dabr.ca/notice/B1YPr3scGjZMCQYdYO)，提到了 Reitti 这个工具，于是开始了这次折腾。
Reitti 要用 PostGIS，但是这个没有 Docker 的 ARM64 Image，所以我最开始是放弃的。不过想着~~下雨天打孩子~~放假，闲着也是闲着，
所以我折腾了在我手里唯一一个低功耗 x86 设备——小米平板2 上面装了一个 Ubuntu （是真™耗时间啊），然后跑来玩玩，倒入了点数据，感觉可视化做的还不错。
于此同时，我也装了整套 OwnTracks 解决方案，在这个假期都把玩了一把。

先说我最后剩下来的解决方案吧。我最后手机上用的是 Overland App，数据发到一个 Deno 的服务端，服务端会把把请求写到磁盘上保留原始数据（学 OwnTracks Recorder），
写到我自己创建的 Postgre 数据表（继续用我的 Grafana），以及最后把请求原封不动地发给 Reitti。

Owntracks 其实有自己的 App，服务端用的是 C 写的，它整套系统其实设计的非常克制，追求做到 Apple Find My 那种可以跟朋友实时共享位置的功能。这里我说克制，
一方面是功能上非常简单（可靠），另一方面就是服务端资源占用非常低。它最开始只有 MQTT 一种协议，后面才加的 HTTP 协议。MQTT 还用的 mTLS 认证，让我觉得
难能可贵。我觉得这个项目我比较不喜欢的也是 MQTT，这玩意上传数据是持久链接，客户端可能因此比其他解决方案要费电很多。用 HTTP 貌似也不支持 batch 的，所以看到有人抱怨
其消耗流量很多。服务端的思想就是尽可能保留数据，所以基本上就是把收到的请求都写成了文本文件。可视化默认给了一个非常基本的 HTML 网页，也有一个 Vue 的版本，
只是展示数据吧，还是非常基本，还不如我用 Grafana dashboard 搞的好看。所以我没打算长期使用，可是服务端是在不费资源，我也就留着了，想看看后面会不会有别的发展，
不过也不一定，这个项目已经 10 年了，虽然还活跃，但是已经算非常固定了。

Reitti 这个项目用的是 Java 写的，内存消耗非常大，特别是倒入数据和处理的时候。但是它在可视化方面做了很多努力，可以生成年度、月度的分析，比如在某个地方呆了多久、
大概用了什么交通方式（根据速度）。不过它的设计非常着重于隐私，对于坐标点换算成地名，可以下载 Open Street Map 的离线数据来自己查，而不用调用 API （不过坦白说，
我就图方便了，没那么做）。Reitti 的数据也只存了三维坐标信息，可视化部分也只用了二维信息，像速度信息是没有存的，所以我也不大喜欢它丢了那么多数据（虽然没啥用就是了）。
数据导出方面，它目前做的也很简陋，导出界面稍微选得长一点，就卡死了。当然，都自己部署了，写代码倒出也不是什么难事。不过考虑到这么多，我目前也就是当它是一个可视化的 UI，
没有奢求更多。因为最后要用 Reitti 了，我又折腾了好一会，数据库直接装 docker 外面了。导入数据的时候，Reitti 还把数据库进程给写挂了，不过重启能搞定。

最后，我现在这样的设置，数据安全方面，其实不见得比 Arc 更好，Overland 也可能被 iOS 杀掉，就不记录数据了；我家的服务器，两天才备份一次，要是没即时备份，数据也会丢；
我家的服务器，可用性也不高，但 Overland 会先存本地手机上，直到服务器确认才删除，所以可能问题不大。不过我还是期待 Overland 可以（或者有什么别的 App 可以）存数据到
手机的长期存储。

写了这么多，贴一下我用的代码，万一有用呢？就 MIT License 吧，不存 Github 了，大部分都是 GPT 写的，我是真的懒啊。。

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


```sql
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

