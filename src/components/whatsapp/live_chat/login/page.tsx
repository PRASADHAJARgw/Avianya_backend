import LoginClientComponent from "./LoginClientComponent";
import LoginWrapper from "./LoginWrapper";

export default async function LoginServerComponent() {
    const wrapper = await LoginWrapper({ children: <LoginClientComponent /> });
    return (
        <>
            {wrapper}
        </>
    );
}
