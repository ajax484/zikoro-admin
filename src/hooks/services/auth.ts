"use client";

import { loginSchema, onboardingSchema } from "@/schemas";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getRequest, postRequest } from "@/utils/api";
import { TAuthUser, TUser } from "@/types";
import useOrganizationStore from "@/store/globalOrganizationStore";
import useEventStore from "@/store/globalEventStore";
import useUserStore from "@/store/globalUserStore";

const supabase = createClientComponentClient();
export const saveCookie = (name: string, value: any) => {
  if (typeof value !== "string") {
    const newValue = JSON.stringify(value);
    Cookies.set(name, newValue);
  } else {
    Cookies.set(name, value);
  }
};

export const getCookie = <T = any>(name: string): T | undefined => {
  let value: T | undefined;

  try {
    const jsonString = Cookies.get(name);
    if (typeof jsonString === "string") {
      value = JSON.parse(jsonString) as T;
    }
  } catch (error) {
    console.error("Error parsing cookie:", error);
  }

  return value;
};

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserStore();
  const router = useRouter();

  type CreateUser = {
    values: z.infer<typeof onboardingSchema>;
    email: string | null;
    createdAt: string | null;
  };
  async function registration(
    values: z.infer<typeof onboardingSchema>,
    email: string | null,
    createdAt: string | null
  ) {
    try {
      setLoading(true);
      const { data, status } = await postRequest<CreateUser>({
        endpoint: "/auth/user",
        payload: {
          ...values,
          userEmail: email,
          created_at: createdAt,
        },
      });

      if (status === 201 || status === 200) {
        const user = await getUser(email);
        setUser(user);
        setLoading(false);
        toast.success("Profile Updated Successfully");
        router.push("/home");
      }

      return data;
    } catch (error: any) {
      //
      toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }
  return {
    registration,
    loading,
  };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setLoggedInUser } = useSetLoggedInUser(); // Assuming this is a hook

  async function logIn(
    values: z.infer<typeof loginSchema>,
    redirectTo: string | null
  ) {
    setLoading(true);
    try {
      console.log("here");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error?.message);
        // console.log(error?.message);
        setLoading(false);
        return;
      }

      if (data && data?.user?.email) {
        await setLoggedInUser(data?.user?.email);
        //  console.log(data?.user?.email);
        toast.success("Sign In Successful");
        router.push(redirectTo ?? "home");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return {
    logIn,
    loading,
  };
}
export function useValidateUser() {
  const { user } = useUserStore();
  const router = useRouter();

  // using this to redirect new users to onboarding
  // before modiifcation from the TL

  useEffect(() => {
    async function verifyUser() {
      //  console.log({user})
      if (!user?.userEmail) {
        router.push("/login");
      }
    }

    verifyUser();
  }, []);
}

export const useSetLoggedInUser = () => {
  const { setUser } = useUserStore();

  const setLoggedInUser = async (email: string | null) => {
    if (!email) return;
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("userEmail", email)
      .single();
    if (error) {
      //  console.log({error});
      window.open(
        `/onboarding?email=${email}&createdAt=${new Date().toISOString()}`,
        "_self"
      );
      return;
    }
    console.log(user);
    setUser(user);
    return user;
  };

  return { setLoggedInUser };
};

export const getUser = async (email: string | null) => {
  if (!email) return;
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("userEmail", email)
    .single();
  if (error) {
    //  console.log({error});
    window.open(
      `/onboarding?email=${email}&createdAt=${new Date().toISOString()}`,
      "_self"
    );
    return;
  }
  // console.log(user);
  // saveCookie("user", user);
  return user;
};

export function useRegistration() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function register(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/${
            values?.email
          }/${new Date().toISOString()}`,
          data: {
            platform: "Event"
          }
        },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        //  saveCookie("user", data);
        toast.success("Registration  Successful");
        router.push(
          `/verify-email?message=Verify your Account&content= Thank you for signing up! A verification code has been sent to your registered email address. Please check your inbox and enter the code to verify your account.&email=${values.email}&type=verify`
        );
      }
    } catch (error) {
      setLoading(false);
    }
  }
  return {
    register,
    loading,
  };
}

export function useLogOut(redirectPath: string = "/") {
  const router = useRouter();
  const { setOrganization } = useOrganizationStore();
  const { setEvent } = useEventStore();
  const { setUser } = useUserStore();

  async function logOut() {
    setUser(null);
    setOrganization(null);
    setEvent(null);
    router.push(redirectPath);
  }

  return {
    logOut,
  };
}

export function useGetAuthUser() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<TAuthUser | null>(null);

  const getUser = async () => {
    setLoading(true);
    try {
      const { data, status } = await getRequest<TAuthUser>({
        endpoint: `/auth/user`,
      });

      if (status !== 200) {
        throw data;
      }

      setUser(data.data);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getUser();
  }, []);

  return {
    user,
    loading,
  };
}

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function forgotPassword(email: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        //  saveCookie("user", data);

        router.push(
          `/verify-email?message=Reset Password&content=If the email you entered is registered, we've sent an OTP code to your inbox. Please check your email and follow the instructions to reset your password.&email=${email}&type=reset-password`
        );
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    forgotPassword,
    loading,
  };
}

export function useUpdatePassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updatePassword(password: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        //  saveCookie("user", data);
        toast.success("Password Reset Successfully");
        router.push(`/login`);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    updatePassword,
    loading,
  };
}

export function useResendLink() {
  const [loading, setLoading] = useState(false);

  async function resendLink(email: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return {
    resendLink,
    loading,
  };
}

export function useVerifyCode() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function verifyCode(email: string, token: string, type: string | null) {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        throw error;
      }

      if (type === "reset-password") {
        router.push(`${window.location.origin}/update-password`);
      } else {
        router.push(
          `${
            window.location.origin
          }/onboarding?email=${email}&createdAt=${new Date().toISOString()}`
        );
      }
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    verifyCode,
  };
}

export function useAttendee({
  email,
  isPasswordless,
}: {
  email?: string; // Optional
  isPasswordless?: string; // Optional
}) {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const { eventId } = useParams();
  const [userData, setUserData] = useState<TUser | null>(null);

  const getUser = async () => {
    setLoading(true);
    try {
      if (email && isPasswordless) {
        // Fetch user only if email and isPasswordless are provided
        const { data } = await getRequest<TUser>({
          endpoint: `/users/attendee/${email}`,
        });

        if (data?.data) {
          setUser(data.data); 
          setUserData(data.data);
        } else if (!user) {
    
          router.push(`/request/access/${eventId}`);
        }
      } 
    } catch (error) {
      console.error("Error fetching attendee data:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
  
    if (!user) {
      getUser(); 
    } else {
      setUserData(user);
      setLoading(false);
    }
   
  }, [email, isPasswordless, user]);

  return {
    userData,
    user,
    loading,
  };
}

export const useGetUserId = () => {
  const getUserId = async (
    email: string | null
  ): Promise<string | undefined> => {
    if (!email) return;

    const { data: user, error } = await supabase
      .from("users")
      .select("id") // Select only the id field
      .eq("userEmail", email)
      .order("created_at", { ascending: false })
      .single();

    if (error) {
      console.error("Error fetching user ID:", error);
      return;
    }
    return user.id; // Return the user ID
  };

  return { getUserId };
};

