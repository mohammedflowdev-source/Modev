import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function Button(props: {
    variant: `primary` | `secondary` | "text";
    iconAfter?: ReactNode;
    /** Render as a <span> when the button sits inside a link (a <button> inside <a> is invalid HTML). */
    as?: "button" | "span";
} & ButtonHTMLAttributes<HTMLButtonElement>) {
    const { className, children, variant, iconAfter, as = "button", ...rest } = props;
    const classes = twMerge("h-11 px-6 rounded-xl  border border-red-orange-500 uppercase inline-flex items-center gap-2 transition duration-500 relative group/button", variant === "primary" && "bg-red-orange-500 text-white", variant === "secondary" && `hover:bg-red-orange-500 hover:text-white`, variant === "text" && "h-auto px-0 border-transparent after:transition-all after:duration-500  after:content-[''] after:h-px after:w-0 after:absolute after:top-full after:bg-red-orange-500 hover:after:w-full", className);
    const content = <>
        <span>{children}</span>
        {iconAfter && <span>{iconAfter}</span>}
    </>;

    if (as === "span") {
        return <span className={classes} {...(rest as HTMLAttributes<HTMLSpanElement>)}>{content}</span>;
    }
    return <button className={classes} {...rest}>{content}</button>;
}
