import { useGoogleReCaptcha } from "react-google-recaptcha-hook";
import { channelClient } from "./channelClient";

export const useIsRobot = () => {
    const { executeGoogleReCaptcha } = useGoogleReCaptcha("6Ld-kxUqAAAAAPLYxnzZgI9Ox0swMKCQz8GkzpHA");

    const checkIsRobot = async () => {
        if (!executeGoogleReCaptcha) {
            console.warn("Recaptcha not ready");
            return null;
        }

        try {
            const token = await executeGoogleReCaptcha("submit");
            const response = await channelClient.post(`/api/v1/recaptcha?token=${token}`);
            return response.data;
        } catch (error) {
            console.error("Error checking reCAPTCHA:", error);
            return null;
        }
    };

    return { checkIsRobot };
};
