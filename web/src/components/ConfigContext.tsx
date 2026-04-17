"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

interface ConfigContextType {
  shopName: string;
  setShopName: (name: string) => void;
  refreshConfigs: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [shopName, setShopNameState] = useState("Antigravity Coffee");

  const refreshConfigs = async () => {
    try {
      const configs = await api.getConfigs();
      const nameConfig = configs.find((c: any) => c.key === "ShopName");
      if (nameConfig) {
        setShopNameState(nameConfig.value);
      }
    } catch (error) {
      console.error("Failed to fetch configs:", error);
    }
  };

  useEffect(() => {
    refreshConfigs();
  }, []);

  const setShopName = async (name: string) => {
    try {
      await api.updateConfig("ShopName", { key: "ShopName", value: name });
      setShopNameState(name);
    } catch (error) {
      console.error("Failed to update shop name:", error);
    }
  };

  return (
    <ConfigContext.Provider value={{ shopName, setShopName, refreshConfigs }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
