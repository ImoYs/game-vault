// src/app/game/[id]/metadata.ts

export async function generateMetadata({ params }: { params: { id: string } }) {
    return {
      title: `Game: ${params.id}`,
      description: "Game details page",
    };
  }
  