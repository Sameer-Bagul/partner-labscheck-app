'use client'

import API from "@/lib/axios-client";
import { useAuth } from "@/providers/auth-Provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const buttonVariants: Variants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
};

const RedirectingPage = () => {
    const router = useRouter();
    const { setupOAuthSession } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const handleOAuth = async () => {
            try {
                const result = await setupOAuthSession();
                console.log("OAuth Setup Result: ", result);

                if (result) {
                    // Show success state before redirect
                    setSuccess(true);

                    // Redirect after short delay
                    setTimeout(() => {
                        router.push("/laboratory");
                    }, 1500); // 1.5 seconds
                } else {
                    setError("Authentication failed. Please try signing in again.");
                }
            } catch (err) {
                console.error(err);
                setError("Authentication failed. Please try signing in again.");
            } finally {
                setLoading(false);
            }
        };
        handleOAuth();
    }, [router, setupOAuthSession]);

    return (
        <div className="flex flex-col items-center justify-center h-screen px-4">
            <AnimatePresence mode="wait">
                {/* Loading State */}
                {loading && !success && (
                    <motion.div
                        key="loading"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center"
                    >
                        <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                        <h1 className="text-xl font-semibold text-gray-700">
                            Checking authentication...
                        </h1>
                        <p className="text-gray-500 mt-2">This may take a few seconds</p>
                    </motion.div>
                )}

                {/* Success State */}
                {success && (
                    <motion.div
                        key="success"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center"
                    >
                        <FaCheckCircle className="text-5xl text-green-500 mb-4" />
                        <h1 className="text-xl font-semibold text-gray-700">
                            Successfully authenticated!
                        </h1>
                        <p className="text-gray-500 mt-2">Redirecting to your laboratory...</p>
                    </motion.div>
                )}

                {/* Error State */}
                {error && (
                    <motion.div
                        key="error"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"
                    >
                        <h1 className="text-2xl font-bold mb-6 text-red-800">
                            Authentication Error
                        </h1>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <motion.button
                            onClick={() => router.push("/signin")}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="bg-red-600 text-white px-6 py-3 rounded-lg w-full shadow-md"
                        >
                            Go to Sign In
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RedirectingPage;
