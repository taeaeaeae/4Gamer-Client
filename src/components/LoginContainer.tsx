import { useEffect } from 'react';
import { useToggle, upperFirst } from '@mantine/hooks';
import { GoogleButton } from './css/GoogleButton';
import { useNavigate } from "react-router-dom";
import { useIsRobot } from '../api/captchaApi';
import {
  login,
  signup
} from '../api/auth';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Anchor,
  Stack,
} from '@mantine/core';


export function LoginContainer() {

  const navigate = useNavigate();
  const { checkIsRobot } = useIsRobot();
  const [type, toggle] = useToggle(['login', 'signup']);

  const handleClick = async () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/member");
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const emailRegex = /^\S+@\S+$/;

      if (type === 'signup') {
        const nickname = formData.get("nickname");
        const email = formData.get("email");
        const password = formData.get("password");

        if (typeof nickname !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
          throw new Error('폼 데이터가 올바르지 않습니다.');
        }
        if (!emailRegex.test(email) || email.length < 8 || email.length > 64) {
          throw new Error('Invalid email: Email should be between 8 and 64 characters and follow email format.');
        }
        if (nickname.length < 2 || nickname.length > 16) {
          throw new Error('Invalid nickname: Nickname should be between 2 and 16 characters.');
        }
        try {
          const result = await checkIsRobot();
          if (result.score < 0.8) {
            throw new Error('사람이 아님');
          }
          const data = await signup(email, password, nickname);
          console.log("data :>> ", data);
          alert('회원 가입이 완료되었습니다. 로그인을 진행해주세요.');
        } catch (error) {
          console.error("Failed to check robot status:", error);
        }

      } else {
        const email = formData.get("email");
        const password = formData.get("password");

        if (typeof email !== 'string' || typeof password !== 'string') {
          throw new Error('폼 데이터가 올바르지 않습니다.');
        }
        if (!emailRegex.test(email) || email.length < 8 || email.length > 64) {
          throw new Error('Invalid email: Email should be between 8 and 64 characters and follow email format.');
        }

        try {
          const result = await checkIsRobot();
          if (result.score < 0.8) {
            throw new Error('사람이 아님');
          }
          const data = await login(email, password);

          console.log("data :>> ", data);

          localStorage.setItem("accessToken", data.accessToken);
          alert('환영합니다.');
          navigate("/main");
        } catch (error) {
          console.error("Failed to check robot status:", error);
        }
      }
    } catch (error) {
      console.error('인증 중 오류 발생:', error);
      alert('인증에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <Paper
        radius="md"
        p="xl"
        withBorder
        style={{
          width: '100%',
          maxWidth: 500,
          maxHeight: 800,
          padding: '2rem',
          overflowY: 'auto'
        }}
      >
        <Text size="lg" fw={500}>
          4Gamer에 오신 것을 환영합니다.
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton onClick={handleClick} radius="xl">Google</GoogleButton>
        </Group>

        <Divider label="이메일로 계속 진행" labelPosition="center" my="lg" />

        <form onSubmit={handleSubmit}>
          <Stack>
            {type === 'signup' && (
              <TextInput
                label="닉네임"
                placeholder="닉네임"
                name="nickname"
                radius="md"
              />
            )}

            <TextInput
              required
              label="이메일"
              placeholder="hello@email.com"
              name="email"
              radius="md"
            />

            <PasswordInput
              required
              label="비밀번호"
              placeholder="********"
              name="password"
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
              {type === 'signup'
                ? '계정이 있으신가요? 로그인'
                : "계정이 없으신가요? 회원가입"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}
