import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from 'react';

export function GoogleLogin() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            navigate("/member");
        }
    }, [navigate]);

    const login = async () => {
        try {
            const token = searchParams.get('token');


            localStorage.setItem("accessToken", `${token}`);
            navigate("/member")
        } catch (error) {
            console.error('로그인 중 오류 발생:', error);
            alert('로그인 실패. 다시 시도해주세요.');
        }
    };

    login()

    return (<>Lodding</>
    );
}
