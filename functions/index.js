const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const fetch = require("node-fetch");

admin.initializeApp();

exports.uploadImageFromUrl = functions.https.onCall(async (data, context) => {
  // Check for authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const { imageUrl } = data;
  if (!imageUrl) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with an 'imageUrl' argument."
    );
  }

  const bucket = admin.storage().bucket();
  const userId = context.auth.uid;
  const fileName = `wordImages/${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
  const file = bucket.file(fileName);

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new functions.https.HttpsError(
        "not-found",
        `Could not fetch image from URL: ${imageUrl}`
      );
    }

    const imageBuffer = await response.buffer();

    await file.save(imageBuffer, {
      metadata: {
        contentType: response.headers.get("content-type"),
      },
    });

    const downloadURL = await file.getSignedUrl({
      action: "read",
      expires: "03-09-2491", // A very long time in the future
    });

    return { downloadURL: downloadURL[0] };
  } catch (error) {
    console.error("Error uploading image from URL:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while processing the image."
    );
  }
});
