// eslint-disable-next-line no-inner-declarations

import { useState, useEffect, useContext } from "react";
import { SocketContext } from "./socket.context";
import { userChatStatusOptions } from "utils/userStatus";
import { useAtom } from "jotai";
import { agentReadWriteAtom } from "store/atoms/agent-atom";

interface IdleTimeoutProps {
  timeout: number;
  children: React.ReactNode;
}

const IdleTimeout: React.FC<IdleTimeoutProps> = ({ timeout, children }) => {
  const [agentData] = useAtom(agentReadWriteAtom);
  const userData = agentData.user;
  const isLogin = !agentData.is_authenticated;
  const { socket } = useContext(SocketContext);
  const onIdle = (status: any) => {
    const onlineStatus = status === "active" ? "online" : "away";
    const statusOption = userChatStatusOptions[onlineStatus];
    console.log("new socket", socket);

    // socket.on("user_status_update",(data) => {
    //   console.log("Updated user status received:", data);
    //   // You can update Redux or state here if needed
    // });
    socket?.emit(
      "user_status_update",
      {
        userId: userData?.id,
        chatStatusData: statusOption,
      },
      (ack: any) => {
        console.log("ack", ack);

        if (ack?.success) {
          // dispatch(handleUpdateOnlineUser({ [userData?.id]: onlineStatus }));
        }
      }
    );
    socket?.off();
  };

  const updatedStatus: { status?: string } | null = JSON.parse(
    localStorage.getItem("online_status") ?? "null"
  );

  const [isActive, setIsActive] = useState<boolean>(false);

  function resetTimer(activityTimer: NodeJS.Timeout, onIdle: (status: string) => void, timeout: number) {
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
      onIdle("inactive");
    }, timeout);
  }
  
  function handleActivity(
    isActive: boolean,
    setIsActive: (active: boolean) => void,
    activityTimer: NodeJS.Timeout,
    resetTimer: () => void,
    onIdle: (status: string) => void
  ) {
    if (!isActive) {
      onIdle("active");
      setIsActive(true);
      clearTimeout(activityTimer);
    }
    resetTimer();
  }
  
  useEffect(() => {
    if (isLogin) {
      let activityTimer: NodeJS.Timeout = setTimeout(() => {}, 0);
  
      const handleUserActivity = () => {
        handleActivity(isActive, setIsActive, activityTimer, () => resetTimer(activityTimer, onIdle, timeout), onIdle);
      };
  
      window.addEventListener("mousemove", handleUserActivity);
      window.addEventListener("keydown", handleUserActivity);
      window.addEventListener("touchstart", handleUserActivity);
  
      resetTimer(activityTimer, onIdle, timeout);
  
      return () => {
        window.removeEventListener("mousemove", handleUserActivity);
        window.removeEventListener("keydown", handleUserActivity);
        window.removeEventListener("touchstart", handleUserActivity);
        clearTimeout(activityTimer);
      };
    }
  }, [timeout, isActive, onIdle, isLogin]);

  return <>{children}</>;
};

export default IdleTimeout;
