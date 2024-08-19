//영문자와 숫자만 허용, 5글자 이상 15글자 이하
const idRegx = /^[a-zA-Z0-9]{5,15}$/;
//영문자와 숫자 모두 하나 이상 포함, 8글자 이상 15글자 이하
const pwRegx = /^(?=.*[a-zA-Z])(?=.*\d).{8,15}$/;
//한글만 허용, 2글자 이상 5글자 이하
const userNameRegx = /^[가-힣]{2,5}$/;
//이메일 정규표현식
//영어|숫자 @ 영어|숫자.영어2글자 이상
const emailRegx = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
//M or W
const genderRegx = /^[M|W|m|w]$/;
//1900-2000년대, YYYY-MM-DD
const birthRegx = /^(19|20)\d{2}-(0[1-9]|1[0-2])-([0-2][1-9]|3[01])$/;
//1글자 이상 10글자 이하
const categoryNameRegx = /^.{1,10}$/;
//1글자 이상 30글자 이하
const postTitleRegx = /^.{1,30}$/;
//1글자 이상 500글자 이하
const postContentRegx = /^.{1,500}$/;
//1글자 이상 100글자 이하
const commentRegx = /^.{1,100}$/;

export const regx = {
  idRegx: idRegx,
  pwRegx: pwRegx,
  userNameRegx: userNameRegx,
  emailRegx: emailRegx,
  genderRegx: genderRegx,
  birthRegx: birthRegx,
  categoryNameRegx: categoryNameRegx,
  postTitleRegx: postTitleRegx,
  postContentRegx: postContentRegx,
  commentRegx: commentRegx,
};
