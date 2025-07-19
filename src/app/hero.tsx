"use client";

import Image from "next/image";
import { Button, Typography, Card } from "@material-tailwind/react";
import MusicPlayer from '@/components/MusicPlayer';
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Hero() {
  const [showPlayer, setShowPlayer] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null); // 👈 Referencia al reproductor

  const handleTogglePlayer = () => {
    const willShow = !showPlayer;
    setShowPlayer(willShow);

    // 👇 Si se va a mostrar y estamos en pantalla pequeña, hacemos scroll
    if (willShow && typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100); // Le damos un pequeño delay para que aparezca primero
    }
  };

  return (
    <div className="flex flex-col items-center px-10 w-full">
      {/* Imagen de fondo */}
      <Image
        width={1200}
        height={1200}
        src="/image/image.png"
        alt="bg-img"
        className="absolute inset-0 ml-auto w-[920px] h-[780px] rounded-bl-[100px] object-cover object-center"
      />

      <div className="container mx-auto mt-28 z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Card principal */}
          <Card className="flex-1 rounded-xl border border-gray bg-gray-900 py-10 p-8 shadow-lg shadow-black/10 backdrop-blur-sm backdrop-saturate-200">
            <Typography
              variant="h1"
              className="lg:text-5xl !leading-snug text-3xl lg:max-w-3xl text-orange-900"
            >
              Pide tu canción
            </Typography>
            <Typography variant="lead" className="mb-10 mt-6 !text-gray-200">
              Te busco entre mis canciones de Spotify lo que mejor se adapte a lo que quieras. ¿Oreja de Van Gogh? Lo tengo. ¿La cumbia que le gustaba a tu papá en los 90? También.
            </Typography>

            <div className="mb-8 flex justify-center gap-4 lg:justify-start">
              <Button color="orange" onClick={handleTogglePlayer}>
                {showPlayer ? "Quita quita" : "Aer"}
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 items-center justify-between gap-4 lg:justify-start">
              <Image width={144} height={144} className="w-36 grayscale opacity-60" src="/logos/logo-spotify.svg" alt="pinterest" />
              <Image width={144} height={144} className="w-36 grayscale opacity-60" src="/logos/logo-netflix.svg" alt="netflix" />
              <Image width={144} height={144} className="w-36 grayscale opacity-60" src="/logos/logo-crunchy.svg" alt="crunchyroll" />
              <Image width={144} height={144} className="w-36 grayscale opacity-60" src="/logos/logo-google.svg" alt="google" />
            </div>
          </Card>

          {/* Reproductor */}
          <AnimatePresence>
            {showPlayer && (
              <motion.div
                ref={playerRef} // 👈 Aquí se enfoca
                className="w-full lg:w-[400px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <MusicPlayer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Hero;
