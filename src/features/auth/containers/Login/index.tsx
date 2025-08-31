import { ROUTE_PATH } from '@/common';
import { useLogin } from '@/features/auth/react-query';
import {
  Flex,
  Form,
  FormItem,
  Input,
  InputPassword,
  Link,
  setStorageItem,
  STORAGE_KEY,
  Text,
} from '@/lib';
import { useAppDispatch } from '@/redux/hooks';
import { getUserInfo } from '@/redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { LoginBox, LoginFormWrapper, LoginIllustration, Root } from './styles';
import type { ILoginRequest } from '@/dtos';
import Logo from '@/assets/svg_nexamart _horizontal.svg';
import { Button } from 'antd';
const LoginContainer = () => {
  const [changePasswordForm] = Form.useForm<ILoginRequest>();
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoadingLogin } = useLogin();
  const dispatch = useAppDispatch();

  const onLogin = async (values: ILoginRequest) => {
    login(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: async (data) => {
          setStorageItem(STORAGE_KEY.TOKEN, data.data.accessToken);
          await dispatch(getUserInfo());
          navigate(ROUTE_PATH.ADMIN.PATH());
        },
        onError: (error) => {
          //   notify('error', {
          //     message: t('error'),
          //     description: error.message,
          //   });
          console.log('error', error);
        },
      },
    );
  };

  return (
    <Root justify="center" align="center">
      <LoginBox>
        <LoginIllustration
          justify="center"
          align="center"
          flex={1}
        ></LoginIllustration>
        <Flex vertical justify="center" align="center" gap={16} flex={1}>
          <Flex align="center" vertical gap={24}>
            <img src={Logo} alt="Logo" />
            <Text>Đăng nhập</Text>
          </Flex>
          <LoginFormWrapper>
            <Form
              form={changePasswordForm}
              onFinish={onLogin}
              layout="vertical"
              size="large"
              style={{ width: '100%' }}
            >
              <FormItem<ILoginRequest>
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập email',
                  },
                ]}
              >
                <Input placeholder="Email" />
              </FormItem>

              <FormItem<ILoginRequest>
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu',
                  },
                ]}
              >
                <InputPassword placeholder="Mật khẩu" />
              </FormItem>

              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingLogin}
                style={{ width: '100%' }}
              >
                Đăng nhập
              </Button>
            </Form>
          </LoginFormWrapper>

          <Link to={ROUTE_PATH.AUTH.FORGOT_PASSWORD.PATH()} color="#2b499e">
            Quên mật khẩu?
          </Link>
        </Flex>
      </LoginBox>
    </Root>
  );
};

export default LoginContainer;
