"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useCallback } from "react";
import ConfirmModal from "@/components/popup/confirm";

export default function Header() {
    const { isLoggedIn, logout, user } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        message: "",
        onConfirm: () => { },
        confirmText: "확인",
        cancelText: "취소"
    });

    const openModal = useCallback((message: string, onConfirm: () => void, confirmText?: string, cancelText?: string) => {
        setModalContent({ message, onConfirm, confirmText: confirmText || "확인", cancelText: cancelText || "취소" });
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleLogout = () => {
        openModal(
            "로그아웃 하시겠습니까?",
            () => {
                logout();
                alert("로그아웃 되었습니다!");
                closeModal();
            }
        );
    };

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
                업무_게시판
            </Link>
            <nav>
                {isLoggedIn ? (
                    <div className="flex items-center space-x-4">
                        <div>{user?.nickname}님</div>
                        <button type="button" onClick={handleLogout} className="hover:text-gray-300">
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <Link href="/login" className="hover:text-gray-300">
                        로그인
                    </Link>
                )}
            </nav>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={modalContent.onConfirm}
                message={modalContent.message}
                confirmText={modalContent.confirmText}
                cancelText={modalContent.cancelText}
            />
        </header>
    );


}