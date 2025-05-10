"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Bell, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const featuresData = [
  {
    icon: <AlertTriangle className="h-10 w-10 text-eco-warning" />,
    title: "Real-Time Alerts",
    description:
      "Receive immediate notifications about climate emergencies and natural disasters in your area.",
  },
  {
    icon: <Info className="h-10 w-10 text-eco-blue" />,
    title: "Educational Resources",
    description:
      "Access vital information on preparedness, survival strategies, and climate adaptation techniques.",
  },
  {
    icon: <Bell className="h-10 w-10 text-eco-green" />,
    title: "Customized Notifications",
    description:
      "Subscribe to alerts relevant to your location and specific climate concerns.",
  },
  {
    icon: <Users className="h-10 w-10 text-eco-blue-dark" />,
    title: "Community Forum",
    description:
      "Connect with local communities to share experiences, resources and support each other.",
  },
];
export default function  HomePage(){
    const router=useRouter()
  return (
    <div className="">
      <section className="pt-28 pb-20 eco-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500673922987-e212871fec22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Zm9yZXN0JTIwbGlnaHR8ZW58MHx8fHwxNjIwMTQ2NTg3&ixlib=rb-4.0.3&q=80')] bg-cover bg-center opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-eco-warning/10 border border-eco-warning/30 text-eco-warning font-medium text-sm mb-6 animate-pulse-gentle">
              Climate Connect
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-eco-green-dark leading-tight mb-6">
              Preparing Communities for Climate Challenges
            </h1>

            <p className="text-lg md:text-xl text-eco-green-dark/80 mb-8 max-w-2xl mx-auto">
              Join our network of climate-conscious citizens to receive
              real-time alerts, educational resources, and community support for
              climate resilience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="">
                <Button onClick={()=>router.push("/chatbot")}>Get Started</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>
      <section className="py-20 bg-white" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-eco-green-dark mb-4">
              How Climate Connect Helps You
            </h2>
            <p className="text-eco-green-dark/70 max-w-2xl mx-auto">
              Our integrated platform provides the tools and knowledge you need
              to stay informed and prepared for climate challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className="bg-eco-cream/30 rounded-xl p-6 border border-eco-earth/50 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
              >
                <div className="mb-4 p-3 bg-white rounded-full shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-eco-green-dark mb-3">
                  {feature.title}
                </h3>
                <p className="text-eco-green-dark/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
