import React from "react";
import { Youtube, MessageCircle, Music, Twitter } from "lucide-react";
import TrendCard from "./TrendCard.jsx";
import { C } from "../../theme/theme.js";

const Grid = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
    {children}
  </div>
);

export const YoutubeTrends = ({ data }) => (
  <Grid>
    {data?.length > 0 ? data.map((t, i) => <TrendCard key={i} trend={t} icon={<Youtube size={16} color="#ff0000" />} />) 
    : <p style={{ color: C.textSecondary }}>No YouTube trends.</p>}
  </Grid>
);

export const RedditTrends = ({ data }) => (
  <Grid>
    {data?.length > 0 ? data.map((t, i) => <TrendCard key={i} trend={t} icon={<MessageCircle size={16} color="#FF4500" />} />) 
    : <p style={{ color: C.textSecondary }}>No Reddit trends.</p>}
  </Grid>
);

export const XTrends = ({ data }) => (
  <Grid>
    {data?.length > 0 ? data.map((t, i) => <TrendCard key={i} trend={t} icon={<Twitter size={16} color="#1DA1F2" />} />) 
    : <p style={{ color: C.textSecondary }}>No X trends.</p>}
  </Grid>
);

export const MusicTrends = ({ data }) => (
  <Grid>
    {data?.length > 0 ? data.map((t, i) => <TrendCard key={i} trend={t} icon={<Music size={16} color="#ff0000" />} />) 
    : <p style={{ color: C.textSecondary }}>No Music trends.</p>}
  </Grid>
);
