import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

const donations = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", fallback: "OM", img: "/avatars/01.png" },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", fallback: "JL", img: "/avatars/02.png" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", fallback: "IN", img: "/avatars/03.png" },
  { name: "William Kim", email: "will@email.com", amount: "+$99.00", fallback: "WK", img: "/avatars/04.png" },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", fallback: "SD", img: "/avatars/05.png" },
]

export default function RecentSales() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % donations.length)
    }, 2500) // speed of scrolling

    return () => clearInterval(interval)
  }, [])

  const visible = [
    donations[index],
    donations[(index + 1) % donations.length],
    donations[(index + 2) % donations.length],
  ]

  return (
    <Card
      className="
        group relative
        w-full h-full
        rounded-xl
        border border-white/10
        bg-gray-900
        px-10 py-6
        shadow-2xl
        transition-all
        hover:border-green-500/60
        hover:shadow-green-500/30
      "
    >

      {/* Glow */}
      <div className="
        pointer-events-none 
        absolute inset-0 
        rounded-xl 
        opacity-0 
        transition-opacity 
        group-hover:opacity-100
        bg-gradient-to-r 
        from-green-500/10 
        via-green-500/20 
        to-green-500/10
      " />

      <CardHeader>
        <CardTitle className="text-4xl font-bold text-gray-300">
          Recent Impact
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 grid gap-4 text-gray-300 overflow-hidden">
        {visible.map((user, i) => (
          <div
            key={i}
            className="
              flex items-center gap-4 
              rounded-lg 
              p-3 
              transition 
              hover:bg-green-500/10
              animate-fade
            "
          >
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={user.img} alt="Avatar" />
              <AvatarFallback>{user.fallback}</AvatarFallback>
            </Avatar>

            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none text-white">
                {user.name}
              </p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>

            <div className="ml-auto font-medium text-green-400">
              {user.amount}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
