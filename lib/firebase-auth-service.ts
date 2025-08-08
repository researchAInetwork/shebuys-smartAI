import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './firebase-config'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  styleDNA?: string
  preferences?: any
  createdAt: Date
  lastLoginAt: Date
}

export class FirebaseAuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, displayName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile
      await updateProfile(user, { displayName })

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          styleDNA: '',
          bodyType: '',
          skinTone: '',
          culturalStyle: '',
          budget: { min: 0, max: 500, currency: 'USD' },
          sizes: { tops: 'M', bottoms: 'M', dresses: 'M', shoes: '8' },
          preferredBrands: [],
          avoidedBrands: [],
          region: 'US',
          occasions: [],
          colorPreferences: [],
          sustainabilityPreference: 'medium'
        }
      })

      return user
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date()
      })

      return user
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  // Sign in with Google
  static async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user

      // Check if user document exists, create if not
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            styleDNA: '',
            bodyType: '',
            skinTone: '',
            culturalStyle: '',
            budget: { min: 0, max: 500, currency: 'USD' },
            sizes: { tops: 'M', bottoms: 'M', dresses: 'M', shoes: '8' },
            preferredBrands: [],
            avoidedBrands: [],
            region: 'US',
            occasions: [],
            colorPreferences: [],
            sustainabilityPreference: 'medium'
          }
        })
      } else {
        // Update last login
        await updateDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date()
        })
      }

      return user
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  // Sign out
  static async signOut() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  // Get user profile
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
          lastLoginAt: data.lastLoginAt.toDate()
        } as UserProfile
      }
      
      return null
    } catch (error) {
      console.error('Error getting user profile:', error)
      throw error
    }
  }

  // Update user preferences
  static async updateUserPreferences(uid: string, preferences: any) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        preferences,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error updating user preferences:', error)
      throw error
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
  }
}
