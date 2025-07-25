import { useEffect, useState } from "react";
import { createSocketService } from "../../../services/socket";
import {
  FiSun,
  FiMoon,
  FiZap,
  FiWifi,
  FiWifiOff,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiPower,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function LightControl() {
  const [socketService] = useState(() => createSocketService());
  const [lightStatus, setLightStatus] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    const handleStatusUpdate = (status: boolean) => {
      setLightStatus(status);
      setConnectionStatus("connected");
      setLastAction(new Date().toLocaleTimeString());
    };

    const unsubscribe = socketService.subscribe(handleStatusUpdate);

    // Connect to WebSocket
    socketService.connect("ws://localhost:8000");

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleLight = async () => {
    if (connectionStatus !== "connected") {
      toast.error("Cannot toggle light - connection not established");
      return;
    }

    setLoading(true);
    try {
      const newStatus = !lightStatus;
      socketService.sendLightStatus(newStatus);
      setLightStatus(newStatus);
      setLastAction(new Date().toLocaleTimeString());
      toast.success(`Light turned ${newStatus ? "ON" : "OFF"}`);
    } catch (error) {
      console.error("Error toggling light:", error);
      toast.error("Error toggling light");
    } finally {
      setLoading(false);
    }
  };

  const ConnectionIndicator = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <div className="flex items-center text-green-400">
            <FiWifi className="mr-2" />
            <span>Connected</span>
          </div>
        );
      case "connecting":
        return (
          <div className="flex items-center text-amber-400">
            <FiRefreshCw className="mr-2 animate-spin" />
            <span>Connecting...</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-red-400">
            <FiWifiOff className="mr-2" />
            <span>Disconnected</span>
          </div>
        );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--offer-widget-bg-color-1)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl"
        style={{ backgroundColor: "var(--middle-nav-bg-color-1)" }}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1
              className="text-3xl font-bold flex items-center"
              style={{ color: "var(--top-nav-text-color-1)" }}
            >
              <FiPower className="mr-2" />
              Light Control
            </h1>
            <div className="text-sm font-medium">
              <ConnectionIndicator />
            </div>
          </div>

          <div className="relative mb-8">
            <motion.button
              onClick={toggleLight}
              disabled={loading || connectionStatus !== "connected"}
              className={`relative w-full h-64 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group overflow-hidden ${
                lightStatus ? "bg-opacity-10" : "bg-opacity-5"
              }`}
              style={{
                backgroundColor: lightStatus
                  ? "rgba(235, 200, 12, 0.1)"
                  : "rgba(255, 255, 255, 0.05)",
                border: `2px solid ${
                  lightStatus
                    ? "var(--offer-widget-text-color-2)"
                    : "var(--middle-nav-border-color-1)"
                }`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {lightStatus ? (
                  <motion.div
                    key="on"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <FiSun
                      className="h-24 w-24 mb-4"
                      style={{ color: "var(--offer-widget-text-color-2)" }}
                    />
                    <motion.span
                      className="text-xl font-semibold"
                      style={{ color: "var(--top-nav-text-color-1)" }}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <FiRefreshCw className="animate-spin mr-2" />
                          Turning off...
                        </span>
                      ) : (
                        "Turn OFF"
                      )}
                    </motion.span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="off"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <FiMoon
                      className="h-24 w-24 mb-4"
                      style={{ color: "var(--top-nav-text-color-1)" }}
                    />
                    <motion.span
                      className="text-xl font-semibold"
                      style={{ color: "var(--top-nav-text-color-1)" }}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <FiRefreshCw className="animate-spin mr-2" />
                          Turning on...
                        </span>
                      ) : (
                        "Turn ON"
                      )}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="p-4 rounded-xl"
              style={{ backgroundColor: "var(--offer-widget-bg-color-1)" }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center mb-2">
                <div
                  className={`h-3 w-3 rounded-full mr-2 ${
                    lightStatus ? "bg-green-400" : "bg-gray-400"
                  }`}
                ></div>
                <h3
                  className="text-sm font-medium"
                  style={{ color: "var(--offer-widget-text-color-2)" }}
                >
                  Current Status
                </h3>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--top-nav-text-color-1)" }}
              >
                {lightStatus ? "ACTIVE" : "INACTIVE"}
              </p>
            </motion.div>

            <motion.div
              className="p-4 rounded-xl"
              style={{ backgroundColor: "var(--offer-widget-bg-color-1)" }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center mb-2">
                {lastAction ? (
                  <FiCheckCircle className="text-green-400 mr-2" />
                ) : (
                  <FiAlertCircle className="text-amber-400 mr-2" />
                )}
                <h3
                  className="text-sm font-medium"
                  style={{ color: "var(--offer-widget-text-color-2)" }}
                >
                  Last Action
                </h3>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--top-nav-text-color-1)" }}
              >
                {lastAction || "Never"}
              </p>
            </motion.div>
          </div>
        </div>

        <div
          className="px-6 py-4 text-center text-sm flex items-center justify-center"
          style={{
            backgroundColor: "var(--offer-widget-bg-color-1)",
            color: "var(--top-nav-seperator-color-1)",
          }}
        >
          <FiZap className="mr-2" />
          Smart Home Hub v2.4
        </div>
      </motion.div>
    </div>
  );
}
