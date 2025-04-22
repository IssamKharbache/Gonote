import { Trash2Icon } from "lucide-react";
import { Todo } from "../todo/TodoList";
import Swal from "sweetalert2";
import { deleteTodoAction } from "@/actions/todo/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DeleteButton = ({ todo }: { todo: Todo }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
    mutationFn: async () => await deleteTodoAction(todo._id),
    mutationKey: ["deleteTodo"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", todo.userId] });
    },
  });
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTodo();
      }
    });
  };
  return (
    <button
      onClick={handleDelete}
      className="flex items-center justify-center w-7 h-7 bg-red-500 rounded-full cursor-pointer"
    >
      <Trash2Icon size={18} className="text-white" />
    </button>
  );
};

export default DeleteButton;
