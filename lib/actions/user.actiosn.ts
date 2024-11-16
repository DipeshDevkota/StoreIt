"use server"

import { Query, ID } from "node-appwrite"; // Import only what is necessary
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";

// Define a type for the user document
interface UserDocument {
    fullName: string;
    email: string;
    avatar: string;
}

const handleError = (error: unknown, message: string): never => {
    console.error(error, message);
    throw new Error(message);
};

const getUserByEmail = async (email: string): Promise<UserDocument | null> => {
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollection,
        [Query.equal("email", [email])]
    );

    return result.documents.length ? result.documents[0] as UserDocument : null; // Cast to UserDocument
};

const sendEmailOTP = async (email: string) => {
    const { account } = await createAdminClient();
    try {
        const session = await account.createEmailToken(ID.unique(), email);
        return session.userId; // Return userId if OTP is sent successfully
    } catch (error) {
        handleError(error, "Failed to send email OTP");
    }
};

export const createAccount = async ({
    fullName,
    email,
}: {
    fullName: string;
    email: string;
}): Promise<void> => {
    // Check if user already exists
    const existingUser  = await getUserByEmail(email);
    if (existingUser ) {
        throw new Error("User  already exists with this email.");
    }

    // Send OTP
    const accountId = await sendEmailOTP(email);
    if (!accountId) {
        throw new Error("Failed to send an OTP");
    }

    // Create new user document
    const { databases } = await createAdminClient();
    try {
        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollection,
            ID.unique(),
            {
                fullName,
                email,
                avatar: "data:image/png;base64,iVBOR..." // Replace with a valid avatar or handle appropriately
            }
        );
    } catch (error) {
        handleError(error, "Failed to create user account");
    }
};