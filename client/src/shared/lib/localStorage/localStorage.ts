import { User } from '@/entities/User/User';

export const saveUserProfileToLocalStorage = (profile: User | null) => {
    if (profile) {
        localStorage.setItem('profile', JSON.stringify(profile));
    } else {
        localStorage.removeItem('profile');
    }
};

export const getUserProfileFromLocalStorage = (): User | null => {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(profile) : null;
};
