"use client";

import { Mail } from "lucide-react"; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <>
      {/* Main content */}
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-600 text-white">
          <section className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold">
              Dive into the World of Anonymous Feedback
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg">
              True Feedback - Where your identity remains a secret.
            </p>
          </section>

          {/* Carousel for Messages */}
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-3xl"
          >
            <CarouselContent className="space-y-4">
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="w-full md:w-96 lg:w-112 xl:w-128">
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl lg:text-3xl">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8" />
                      <div>
                        <p className="text-base md:text-lg lg:text-xl">
                          {message.content}
                        </p>
                        <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2024 Anonymous Feedback. All rights reserved.
      </footer>
    </>
  );
}
