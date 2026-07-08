import { doc, getDoc } from "firebase/firestore";
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import type { AuthUser } from "@/contexts/AuthContext";
import type { User as FirebaseUser } from "firebase/auth";

export async function firebaseToAuthUser(fbUser: FirebaseUser): Promise<AuthUser> {
  let fullName = fbUser.displayName || "";
  let phone = fbUser.phoneNumber || "";
  let profileImageUrl = fbUser.photoURL;

  if (isFirebaseConfigured && firebaseDb) {
    try {
      const ref = doc(firebaseDb, "users", fbUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data: any = snap.data();
        fullName = data.firstName ? data.firstName + " " + (data.lastName || "") : fullName;
        phone = data.phone || phone;
        profileImageUrl = data.profileImage || profileImageUrl;
      }
    } catch (_e) {
      console.warn("[Auth] Firestore fetch failed:", _e);
    }
  }

  return {
    id: fbUser.uid,
    fullName: fullName || (fbUser.email ? fbUser.email.split("@")[0] : "User"),
    email: fbUser.email || "",
    phone,
    role: "customer",
    status: "active",
    profileImageUrl,
    preferredLanguage: "en",
  };
}
