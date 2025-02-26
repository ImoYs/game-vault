import React from "react";
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { CommentType } from "@/components/Comment/CommentSection";
import IconButton from "@/components/ui/IconButton";

interface CommentItemProps {
    comment: CommentType;
    session: any;
    editingCommentId: string | null;
    setEditingCommentId: (id: string | null) => void;
    editedComment: string;
    setEditedComment: (content: string) => void;
    handleUpdate: (commentId: string, newContent: string) => Promise<void>;
    handleCancelEdit: () => void;
    handleDelete: (commentId: string, parentId: string | null) => Promise<void>;
    replyingToCommentId: string | null;
    setReplyingToCommentId: (id: string | null) => void;
    replyContent: string;
    setReplyContent: (content: string) => void;
    handleReplySubmit: (e: React.FormEvent, parentId: string) => Promise<void>;
    setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
}

const formatDate = (date: string | Date) => format(new Date(date), 'dd MMM yyyy, hh:mm a', { locale: enUS });

const CommentItem: React.FC<CommentItemProps> = ({
    comment, session, editingCommentId, setEditingCommentId, editedComment, setEditedComment,
    handleUpdate, handleCancelEdit, handleDelete, replyingToCommentId, setReplyingToCommentId,
    replyContent, setReplyContent, handleReplySubmit, setComments
}) => {
    const isEditing = editingCommentId === comment.id;
    const isReplying = replyingToCommentId === comment.id;
    const isOwner = session?.user?.id === comment.userId;

    return (
        <div key={comment.id} className="border-b py-4">
            <div className="flex justify-between items-start">
                <div className="mr-4">
                    <p className="font-bold">{comment.user?.name || "Unknown User"}</p>
                    <p className="text-sm text-gray-500">POSTED: {formatDate(comment.createdAt)}</p>
                    {comment.updatedAt && new Date(comment.createdAt).toISOString() !== new Date(comment.updatedAt).toISOString() && (
                        <p className="text-sm text-gray-500">last edited: {formatDate(comment.updatedAt)}</p>
                    )}
                </div>
                <div>
                    {isOwner && !isEditing && (
                        <IconButton
                            commentId={comment.id}
                            parentId={comment.parentId}
                            onEdit={setEditingCommentId}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="mt-2">
                    <textarea
                        value={editingCommentId === comment.id ? editedComment || ` ${comment.content}` : ""}
                        onChange={(e) => setEditedComment(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <div className="flex gap-2 mt-2 justify-end">
                        <button onClick={() => handleUpdate(comment.id, editedComment)} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                        <button onClick={handleCancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                    </div>
                </div>
            ) : (
                <p className="mt-2">
                    {comment.content}
                </p>
            )}

            {comment.parentId === null && !isEditing && !isReplying && (
                <button onClick={() => setReplyingToCommentId(comment.id)} className="text-blue-500 mt-2 block">Reply</button>
            )}

            {isReplying && (
                <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-2 flex flex-col gap-2">
                    <textarea
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Write a reply..."
                    />
                    <div className="flex gap-2 justify-end">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit Reply</button>
                        <button type="button" onClick={() => setReplyingToCommentId(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel Reply</button>
                    </div>
                </form>
            )}

            <div className="ml-4 mt-2">
                {comment.replies && comment.replies.length > 0 && (
                    <div>
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                session={session}
                                editingCommentId={editingCommentId}
                                setEditingCommentId={setEditingCommentId}
                                editedComment={editedComment}
                                setEditedComment={setEditedComment}
                                handleUpdate={handleUpdate}
                                handleCancelEdit={handleCancelEdit}
                                handleDelete={handleDelete}
                                replyingToCommentId={replyingToCommentId}
                                setReplyingToCommentId={setReplyingToCommentId}
                                replyContent={replyContent}
                                setReplyContent={setReplyContent}
                                handleReplySubmit={handleReplySubmit}
                                setComments={setComments}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;