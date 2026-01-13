import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import MainLayout from "@/components/MainLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BMR Generator",
  description: "Batch Manufacturing Record Generator for Regulated Environments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#1677ff",
                borderRadius: 4,
              },
            }}
          >
            <MainLayout>
              {children}
            </MainLayout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

