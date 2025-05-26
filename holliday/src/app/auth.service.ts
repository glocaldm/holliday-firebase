import {inject, Injectable} from '@angular/core';
import {Auth, signInWithPopup, GoogleAuthProvider, signOut, User} from '@angular/fire/auth';
import {BehaviorSubject, map, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService {
  http = inject(HttpClient)
  user$ = new BehaviorSubject<User | null>(null);
  private _user$: Observable<User | null>;

  constructor(private auth: Auth) {
    auth.onAuthStateChanged(user => this.user$.next(user));
    this._user$ = this.user$.asObservable()
    this._user$.pipe(
      map((user) => this.verifyAuth(user))
    )
  }

  login() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }

  async getIdToken(): Promise<string | undefined> {
    const user = this.auth.currentUser;
    return user?.getIdToken();
  }

  private verifyAuth(auth: User | null): Observable<Boolean> {
    return auth ? this.http.get("https://verify-and-chat-lelnokmu7a-ew.a.run.app/",
      {headers: {"Authorization": `Bearer ${auth.getIdToken()}`}})
      .pipe(map(v => {
        return v !== null
      })) : of(false)
  }
}
