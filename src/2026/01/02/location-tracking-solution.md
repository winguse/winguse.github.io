---
title: "换了位置时间线工具"
date: 2026-01-02 21:05:00 -0800
---


不知不觉，时间已经划入 2026 年的第二天。本来想写点东西，让 2025 不至于一篇文章都没有，可惜，我懒。
最近放假在家，基本啥也没干，折腾了一圈各种东西，可是就连厨房的防水胶我都还没去重新整。
这里仅记录一下，最近折腾了一圈保存我历史记录工具的小结吧。

最最开始我用的是 Google 的 Timeline History，印象中是从 2010 年开始的。2025 年，这个服务正式进入了 Google 的坟墓。
我去导出过一次数据，不过很可惜，在我执行导出之前，它已经把我 2010 年代的数据 expire 掉了，所以基本没导出任何东西。
2015 年的时候，我开始使用 Moves，后来这个 App 被 Facebook 收购，然后在 2018 年也进了 Facebook 的坟墓。
2018 年折腾了一圈之后，我开始使用 Arc，一直用到最近，才换成了 Overland。

Arc 的数据是保存在 iCloud 上的。我一开始就比较诟病它需要根据我的位置下载一个模型，用于识别我各种活动的类型。
但其实我根本不在乎这个识别（Moves 也有，我同样不在乎）。
随着数据积累变多，在我更换手机的时候，它也曾多次出现导出数据的问题。
我一直默认开启了导出 Daily 和 Monthly 的 GPX 和 JSON 数据，即便如此，它还是让我丢了不少数据。家里领导的手机也是同样的问题。
Arc 是收费的，我觉得我既然用了它，就给了 100 刀，充了个永久解锁。不过感觉这个 App 后期更新、改 Bug 都不怎么积极。
Arc 也曾开源过核心代码，做成了 Arc Mini，不过现在看已经下架了。核心代码开源时用的还是它自己的 Location 库，也就是说，依然需要下载它的模型。
在“凑合用”的层面来说，这个 App 还不错，但它显然在大量数据管理方面做得不太好，而且这个问题感觉有点滚雪球的趋势。

2024 年的冬天，我就开始琢磨着换一种方法。于是我用 PostgreSQL 导入了所有 Arc 的数据，再用 Grafana 做数据可视化，其实我觉得挺不错的。
今年冬天，我看到了一个[帖子](https://dabr.ca/notice/B1YPr3scGjZMCQYdYO)，提到了 Reitti 这个工具，于是开始了这次新的折腾。
Reitti 需要用 PostGIS，但它没有 Docker 的 ARM64 Image，所以我一开始是放弃的。不过想着~~下雨天打孩子~~放假了，闲着也是闲着，就折腾了一下。
我在手里唯一一个低功耗 x86 设备——小米平板 2 上装了 Ubuntu（是真™耗时间啊），然后跑起来玩玩，导入了一点数据，感觉可视化做得还不错。
与此同时，我也装了一整套 OwnTracks 解决方案，这个假期基本都把玩了一遍。

先说我最后留下来的解决方案吧。
我现在手机上用的是 Overland App，数据发送到一个 Deno 写的服务端。服务端会：

1. 把请求写到磁盘上，保留原始数据（学 OwnTracks Recorder）
2. 写入我自己创建的 PostgreSQL 数据表（继续用 Grafana）
3. 最后把请求原封不动地转发给 Reitti

OwnTracks 其实有自己的 App，服务端是用 C 写的。它整套系统的设计非常克制，目标是做成类似 Apple Find My 那样，可以和朋友实时共享位置的功能。
这里说的“克制”，一方面是功能上非常简单（也因此可靠），另一方面是服务端资源占用极低。
它最开始只支持 MQTT 协议，后来才加了 HTTP。MQTT 还用了 mTLS 认证，这一点让我觉得难能可贵。
不过我个人最不喜欢它的一点也正是 MQTT。这玩意儿是持久连接，客户端可能因此比其他方案更费电。
而 HTTP 模式似乎又不支持 batch，所以有人抱怨它流量消耗很大。
服务端的理念是尽可能保留数据，基本就是把收到的请求全写成文本文件。可视化方面默认给了一个非常基础的 HTML 页面，也有一个 Vue 版本，但都只是“能看”的程度，远不如我用 Grafana Dashboard 做得好看。
所以我没打算长期用它。但服务端确实非常省资源，我也就留着了，看看后面会不会有别的发展。不过也不一定，这个项目已经 10 年了，虽然还在维护，但整体已经非常稳定、固定了。

Reitti 是用 Java 写的，内存消耗非常大，尤其是在导入数据和处理的时候。不过它在可视化方面做了很多努力，可以生成年度、月度分析，比如在某个地方待了多久、用了什么交通方式（基于速度判断）。
它的设计非常重视隐私：坐标点转换成地名时，可以下载 OpenStreetMap 的离线数据在本地查询，而不用调用外部 API（不过说实话，我图省事，没这么干）。
Reitti 的数据只存了三维坐标信息，可视化部分也只用了二维数据，像速度这种信息并没有存下来。所以我也不太喜欢它丢了这么多数据（虽然实际上也没啥用）。
数据导出方面，目前做得也很简陋，导出界面稍微选的时间范围长一点，就会卡死。当然，既然是自己部署，写点代码导出也不是什么难事。
综合这些考虑，我目前也只是把它当成一个可视化 UI，并没有奢求更多。
因为最终还是要用 Reitti，我又折腾了一会儿，把数据库直接装在 Docker 外面。导入数据的时候，Reitti 甚至把数据库进程写挂过一次，不过重启之后能搞定。

最后，说说现在这套方案的安全性。
严格来说，数据安全未必比 Arc 更好。Overland 也可能被 iOS 杀掉，导致不记录数据；我家的服务器两天才备份一次，如果没来得及备份，数据也会丢；服务器本身的可用性也不高。
不过 Overland 会先把数据存在手机本地，直到服务器确认接收才删除，所以问题可能也不大。
我还是期待 Overland 能支持（或者有别的 App 能支持）把数据长期存储在手机本地。

写了这么多，最后贴一下我用的代码，万一有人用得上呢。
MIT License，不放 GitHub 了，大部分都是 GPT 写的，我是真的懒啊。。


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

