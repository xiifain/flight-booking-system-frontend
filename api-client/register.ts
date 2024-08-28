import { API } from "@/utils/constants";
import { Axios } from "@/lib/fetcher";
import { RegisterFormDto } from "@/app/(auth)/login/register-form";

export async function register(data: RegisterFormDto) {
  const response = await Axios.post(API.auth.register, data);

  response.data;
}
