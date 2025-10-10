import { message } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleTwoTone,
} from "@ant-design/icons";
import { type ReactNode } from "react";

type MessageTypeKey = "success" | "error" | "info" | "warning";

export const showMessage = (
  type: MessageTypeKey,
  content: string | ReactNode,
  duration: number = 4
): void => {
  let icon: ReactNode;

  switch (type) {
    case "success":
      icon = <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 20 }} />;
      break;
    case "error":
      icon = <CloseCircleOutlined style={{ color: "red", fontSize: 20 }} />;
      break;
    case "info":
      icon = <InfoCircleOutlined style={{ color: "#1890ff", fontSize: 20 }} />;
      break;
    case "warning":
      icon = <ExclamationCircleTwoTone twoToneColor="#faad14" style={{ fontSize: 20 }} />;
      break;
    default:
      icon = null;
  }

  message.open({
    type,
    duration,
    icon,
    content: <div className="text-lg">{content}</div>,
  });
};
