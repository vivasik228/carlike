import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export function Action({href,children,secondary=false,goal,className=''}:{href:string;children:React.ReactNode;secondary?:boolean;goal?:string;className?:string}) {
  return <Link href={href} className={`button ${secondary?'button-secondary':''} ${className}`} data-goal={goal}>{children}<ArrowUpRight size={18} aria-hidden="true"/></Link>;
}
