import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {Auth, User} from '@angular/fire/auth';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AvailabilitiesService} from './availabilities.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let authMock: jasmine.SpyObj<Auth>;

  const mockUser = {
    getIdToken: jasmine.createSpy().and.returnValue(Promise.resolve('fake-token'))
  } as unknown as User;

  beforeEach(() => {
    // Create a spy for Auth
    authMock = jasmine.createSpyObj<Auth>('Auth', ['onAuthStateChanged'], {
      currentUser: mockUser
    });
    const authStub = {
      currentUser: mockUser,
      onAuthStateChanged: (callback: (user: User | null) => void) => callback(mockUser as User)
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {provide: Auth, useValue: authStub}
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  it('should get ID token from current user', async () => {
    const token = await service.getIdToken();
    expect(token).toBe('fake-token');
    expect(mockUser.getIdToken).toHaveBeenCalled();
  });

  it('should call signOut on logout', async () => {
    spyOn(service, 'logout').and.returnValue(Promise.resolve());
    await service.logout();
    expect(service.logout).toHaveBeenCalled();
  });

  it('should login with Google popup', async () => {
    spyOn(service, 'login').and.returnValue(Promise.resolve({ user: mockUser } as any));
    const result = await service.login();
    expect(result.user).toEqual(mockUser);
  });

  it('should emit user when auth state changes', (done) => {
    service.user$.subscribe(user => {
      expect(user).toEqual(mockUser);
      done();
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
