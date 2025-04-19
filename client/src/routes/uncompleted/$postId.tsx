import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/uncompleted/$postId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      postId: params.postId,
    };
  },
  pendingComponent: () => <div className="text-5xl">Loading ....</div>,
});

function RouteComponent() {
  const { postId } = Route.useLoaderData();
  return <div>Hello {postId}</div>;
}
