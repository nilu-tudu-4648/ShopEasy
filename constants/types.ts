export interface UserFormData {
    profilePhoto?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: Date;
    joinDate: Date;
    membershipPlanId: string;
    status: 'active' | 'inactive';
  }
  
  export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    profilePhoto: string;
    dateOfBirth: Date;
    joinDate: Date;
    membershipPlanId: string;
    status: 'active' | 'inactive';
    visits: number;
    plan: {
      name: string;
    };
  }

  export type RootStackParamList = {
    UserList: undefined;
    UserDetail: { userId: string };
    UserRegister: undefined;
  };
