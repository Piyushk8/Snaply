"use client"
import { Card,CardFooter,CardContent,CardHeader } from "../ui/card";
import { BackButton } from "./BackButton";
import Header from "./header";
import { Social } from "./social";

interface CardWrapperProps{
    children:React.ReactNode;
    headerLabel:string;
    backButtonLabel:string;
    backButtonHref:string;
    showSocial?:boolean
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial
}:CardWrapperProps)=>{
     return(
        <Card className="w-96 shadow-md">
            <CardHeader>
                <Header label={headerLabel}></Header>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {
                showSocial && (
                    <CardFooter>
                        <Social/>
                    </CardFooter>
                )
            }
            <CardFooter>
                <BackButton
                    href={backButtonHref}
                    label={backButtonLabel}
                ></BackButton>
            </CardFooter>
        </Card>
     )
}