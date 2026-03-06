import React, { useState, useEffect } from "react";
import axios from "axios"; // API calls ke liye
import { Loader2 } from "lucide-react";
import { C, font } from "../../theme/theme.js";
import { YoutubeTrends, RedditTrends, XTrends, MusicTrends } from "./PlatformViews";

const platformTabs = [
  { id: 'yt', label: 'YouTube' },
  { id: 'yt_Music', label: 'YouTube Music' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'X', label: 'X (Twitter)' },
];

const Trends = () => {
  const [activePlatform, setActivePlatform] = useState('yt');
  const [loading, setLoading] = useState(true);
  const [apiTrends, setApiTrends] = useState({ youtube: [], reddit: [], X: [], youtube_music: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/v1/trending"); // ye 
        if (res.data?.success) {
          const d = res.data.data;
          setApiTrends({
            youtube: (d.youtube || []).map(i => ({ ...i, score: 95, likes: "Trending", tags: ["#yt"] })),
            reddit: (d.reddit || []).map(i => ({ ...i, score: i.score > 100 ? 99 : i.score, likes: i.score, tags: [`#${i.subreddit}`] })),
            X: (d.x || []).map(i => ({ ...i, score: 90, likes: "High", tags: ["#X"] })),
            youtube_music: (d.youtube_music || []).map(i => ({ ...i, score: 88, likes: "Viral", tags: ["#Music"] }))
          });
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: font }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: C.textPrimary, fontSize: 32, fontWeight: 800 }}>Explore Trends</h1>
        <p style={{ color: C.textSecondary, fontSize: 14.5 }}>Discover real-time topics across platforms.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 32, marginBottom: 20, borderBottom: `1px solid ${C.border}` }}>
        {platformTabs.map(tab => (
          <div key={tab.id} onClick={() => setActivePlatform(tab.id)}
            style={{ paddingBottom: 12, cursor: "pointer", borderBottom: activePlatform === tab.id ? `2px solid ${C.accent}` : "2px solid transparent" }}>
            <span style={{ color: activePlatform === tab.id ? C.accent : C.textSecondary, fontSize: 14, fontWeight: activePlatform === tab.id ? 600 : 400 }}>
              {tab.label}
            </span>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "50px 0" }}>
          <Loader2 className="animate-spin" style={{ color: C.accent }} size={40} />
        </div>
      ) : (
        <div>
          {activePlatform === 'yt' && <YoutubeTrends data={apiTrends.youtube} />}
          {activePlatform === 'yt_Music' && <MusicTrends data={apiTrends.youtube_music} />}
          {activePlatform === 'reddit' && <RedditTrends data={apiTrends.reddit} />}
          {activePlatform === 'X' && <XTrends data={apiTrends.X} />}
        </div>
      )}
    </div>
  );
};

export default Trends;









