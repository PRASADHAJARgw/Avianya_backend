'use client'

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate()
    return (
        <Button variant="ghost" className="mx-4 my-2 flex flex-row gap-2" onClick={() => { navigate('/wa/users') }}>
            <ArrowLeftIcon/><span>Back</span>
        </Button>
    )
}