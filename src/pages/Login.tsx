import { SignIn } from "@clerk/clerk-react";

export default function Login() {
    return (
        <div className="flex justify-center items-center flex-col gap-4">
            <SignIn />
        </div>
    )
}