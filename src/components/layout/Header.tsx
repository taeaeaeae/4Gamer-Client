import { useEffect, useState } from "react";
import { getMemberInfo } from "../../api/member";
import { useNavigate } from "react-router-dom";
import { User } from "../../api/types";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { LoginContainer } from "../LoginContainer";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  const preventClose = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  const token = localStorage.getItem("accessToken");

  const webSocketConnection = (userId: string) => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        token: localStorage.getItem("accessToken") || "", 
      },
      debug: (msg) => console.log(msg),
      reconnectDelay: 500000,
      onConnect: () => {
        console.log("Connected");
        stompClient.subscribe(
          `/sub/notification/${userId}`,
          (notification) => {
            console.log("notification: ", notification.body);
          }
        );
      },
    });
    stompClient.activate();
    setClient(stompClient);

    window.addEventListener("beforeunload", preventClose);
  };

  useEffect(() => {
    if (!token) return navigate("/");
    const initialize = async () => {
    const userInfo = await getMemberInfo(token);
    webSocketConnection(userInfo.id);
    navigate("/main");
  };
  initialize();
  
    const getUser = async () => {
      try {
        const data: User = await getMemberInfo(token);
        console.log("data :>> ", data);
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    getUser();
  }, [token]);

  return (
    <div>
      <LoginContainer/>
    </div>
  );
};

export default Header;
