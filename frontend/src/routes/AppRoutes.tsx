import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import BotsList from "../pages/Bots/BotsList";
import BotDetail from "../pages/Bots/BotDetail";
import ConversationsList from "../pages/Conversations/ConversationsList";
import ConversationDetail from "../pages/Conversations/ConversationDetail";

export const AppRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/bots" element={<BotsList />} />
    <Route path="/bots/:botId" element={<BotDetail />} />
    <Route path="/conversations" element={<ConversationsList />} />
    <Route path="/conversations/:conversationId" element={<ConversationDetail />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
