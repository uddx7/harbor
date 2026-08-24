// @ts-expect-error Node test types are intentionally outside the browser-only tsconfig.
import assert from "node:assert/strict";
// @ts-expect-error Node test types are intentionally outside the browser-only tsconfig.
import test from "node:test";
import type { Settings } from "../src/lib/settings/types.ts";
import { compileMpvOptions, svpMpvLines } from "../src/lib/player/mpv-tuning.ts";
import { resolvePlaybackDownloadedFraction } from "../src/lib/player/playback-clock.ts";
import { isLocalUrl } from "../src/lib/player/local-url.ts";

test("isLocalUrl recognizes local filesystem paths and custom asset protocols", () => {
  assert.equal(isLocalUrl("C:\\Downloads\\movie.mkv"), true);
  assert.equal(isLocalUrl("c:/Downloads/movie.mkv"), true);
  assert.equal(isLocalUrl("/home/user/Downloads/movie.mkv"), true);
  assert.equal(isLocalUrl("file:///C:/Downloads/movie.mkv"), true);
  assert.equal(isLocalUrl("asset://localhost/C%3A/movie.mkv"), true);
  assert.equal(isLocalUrl("http://asset.localhost/C%3A/movie.mkv"), true);
  assert.equal(isLocalUrl("https://asset.localhost/C%3A/movie.mkv"), true);
  assert.equal(isLocalUrl("tauri://localhost/video.mp4"), true);
  assert.equal(isLocalUrl("relative/folder/video.mp4"), true);
  assert.equal(isLocalUrl("http://127.0.0.1:11470/stream"), false);
  assert.equal(isLocalUrl("https://realdebrid.com/d/12345/video.mkv"), false);
  assert.equal(isLocalUrl("magnet:?xt=urn:btih:..."), false);
});

test("only the P2P engine reports whole-file download progress", () => {
  assert.equal(
    resolvePlaybackDownloadedFraction({
      isLocal: true,
      isP2pEngine: false,
      streamProgress: 0,
      streamLen: 0,
    }),
    1,
  );
  assert.equal(
    resolvePlaybackDownloadedFraction({
      isP2pEngine: true,
      streamProgress: 50,
      streamLen: 100,
    }),
    0.5,
  );
  assert.equal(
    resolvePlaybackDownloadedFraction({
      isP2pEngine: false,
      streamProgress: 100,
      streamLen: 100,
    }),
    0,
  );
  assert.equal(
    resolvePlaybackDownloadedFraction({
      isP2pEngine: true,
      streamProgress: 50,
      streamLen: 0,
    }),
    0,
  );
});

test("bigger buffer mode increases Harbor defaults and waits for a useful reserve", () => {
  const settings = {
    mpvQuality: "balanced",
    mpvHwdec: "auto",
    mpvBufferBoost: true,
    mpvDownmixStereo: false,
    audioDevice: "auto",
    playerDisplayPanel: "standard",
    playerHdrToSdr: true,
    mpvTweaks: {},
  } as unknown as Settings;

  const options = compileMpvOptions(settings).split("\n");
  assert.ok(options.includes("cache=yes"));
  assert.ok(options.includes("cache-secs=600"));
  assert.ok(options.includes("demuxer-max-bytes=1GiB"));
  assert.ok(options.includes("demuxer-readahead-secs=600"));
  assert.ok(options.includes("cache-pause-initial=yes"));
  assert.ok(options.includes("cache-pause-wait=10"));
  assert.ok(!options.includes("demuxer-max-bytes=150MiB"));
  assert.ok(!options.includes("demuxer-readahead-secs=20"));
});

test("SVP uses a removable labeled VapourSynth filter", () => {
  const settings = { svpVpyPath: "/home/user/.local/share/harbor/svp/svp.vpy" } as Settings;
  const options = svpMpvLines(settings, true).split("\n");
  assert.equal(
    options[0],
    "vf=@harbor-svp:vapoursynth=[/home/user/.local/share/harbor/svp/svp.vpy]",
  );
  assert.ok(options.includes("hwdec=auto-copy"));
});
