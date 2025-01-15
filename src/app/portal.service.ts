import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomSidenavComponent } from './custom-sidenav/custom-sidenav.component';
@Injectable({
  providedIn: 'root'
})
export class PortalService {

  private url = 'http://localhost:8000/api/'; // Adjust as necessary
  token = localStorage.getItem('token')
  private adminPicSubject = new BehaviorSubject<string | null>(null); // This will store the admin image URL
  adminPic$ = this.adminPicSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(data: any){
    return this.http.post(this.url + 'login', data);
  }

  logout(){
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.post(this.url + 'logout', {}, {headers});
  }

  register(data: any){
    console.log(data);
    return this.http.post(this.url + 'register', data);
  }

  //

  getInquiries(uid: any){
    return this.http.get(this.url + 'getInquiries', {params: {uid: uid}})
  }

  //Enrollment Service

  getEnrollments(){
    return this.http.get(this.url + 'enrollments')
  }

  getEnrollmentInfo(eid: any) {
    return this.http.get(this.url + 'enrollmentinfo/' + eid);
  }

  approval(eid: any) {
    return this.http.post(this.url + 'approval/' + eid, {});
  }

  deleteEnrollment(eid: any) {
    return this.http.delete(this.url + 'deleteEnrollment/' + eid, {});
  }

  //Class Service

  getClasses(){
    return this.http.get(this.url + 'getClasses')
  }



  //Section Service

  getSections(){
    return this.http.get(this.url + 'getSections')
  }

  getSubjects(gradeLevel: string, strand: any, semester: any){
    return this.http.get(`${this.url}getSubjects`, { params: { gradeLevel, strand, semester } })
  }

  getSectionsByGradeLevel(gradeLevel: string, strand: any) {
    return this.http.get(`${this.url}getSections`, { params: { gradeLevel, strand } });
  }

  //Roster Service

  createRoster(classIds: any[]) {
    return this.http.post(this.url + 'createRoster', { cid: classIds });
  }

  getRosters(){
    return this.http.get(this.url + 'getRosters')
  }

  getFilteredRosters(params: any){
    return this.http.get(this.url + 'getFilteredRosters', {params})
  }

  getRosterInfo(classIds: any[]) {
    const ids = classIds.join(','); // Join the class IDs into a comma-separated string
    return this.http.get(`${this.url}getRosterInfo?classIds=${ids}`);
}

  getEnrolees(gradeLevel: any, strand: any){
    return this.http.get(this.url + 'getEnrolees', { params: { gradeLevel, strand }})
  }

  //Rostering Service

  getClassInfo(classIds: any[]){
    return this.http.get(this.url + 'getClassInfo', {
      params: {
        classIds: classIds.join(',')
      }
    });
  }

  addStudent(classIds: any[], lrn: any) {
    return this.http.post(this.url + 'addStudent', { cid: classIds, lrn });
  }

  removeStudent(lrn: any) {
    return this.http.delete(this.url + 'removeStudent', {
        body: { lrn } // Correctly include rid and cid in the body
    });
}
  //Grade Service

  countPending(){
    return this.http.get(this.url + 'countPending');
  }

  getClassGrades(params: any){
    return this.http.get(this.url + 'getClassGrades', {params})
  }

  getSubjectRosters(params: any){
    return this.http.get(this.url + 'getSubjectRosters', {params})
  }

  getAllEnrollments(){
    return this.http.get(this.url + 'allenrollments');
  }

  getGrades(lrn: any, syr: any){
    return this.http.get(this.url + 'getGrades/' + lrn + '/' + syr)
  }

  permit(gid: any){
    return this.http.post(this.url + 'permit', { gid } );
  }

  decline(gid: any){
    return this.http.post(this.url + 'decline', { gid } );
  }

  getGradesTP() {
    return this.http.get<any[]>(this.url + 'getGradesTP');
  }
  
  enableTerm(data: { term: string; permission: string }) {
    return this.http.post(this.url + 'enableTerm', data);
  }

  disableTerm(data: { term: string; permission: string }) {
    return this.http.post(this.url + 'disableTerm', data);
  }

  //Message Service

  getStudentParents(){
    return this.http.get(this.url + 'getStudentParents');
  }

  getMessages(uid: any){
    return this.http.get(this.url + 'getMessages', {params: {uid: uid}});
  }

  getConvo(sid: any, uid: any){
    return this.http.get(this.url + 'getConvo/' + sid , {params: {uid: uid}});
  }

  sendMessage(mdata: any){
    return this.http.post(this.url + 'sendMessage', mdata );
  }

  getRecipients(): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'getrecepeints');
  }

  composeMessage(messageData: any): Observable<any> {
    return this.http.post(this.url + 'composemessage', messageData);
  }

  markAsRead(sid: any){
    return this.http.post(this.url + 'markAsRead', {sid});
  }

  getUnreadMessagesCount(uid: any) {
    const params = new HttpParams().set('uid', uid);
    return this.http.get(this.url + 'getUnreadCount', {params});
}

  // account 
  update(adminId: number, oldPassword: string, newData: any): Observable<any> {
    return this.http.put(`${this.url}update-password`, {
      admin_id: adminId,
      oldPassword: oldPassword,
      ...newData
    });
  }
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8000/api/upload-image', formData);
  }
  updateAdminPic(newImageUrl: string) {
    this.adminPicSubject.next(newImageUrl); // Emit new image URL
  }
}
