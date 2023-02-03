import { styles, modalStyle, layoutStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, Modal, TouchableOpacity, Alert } from 'react-native';
import * as React from 'react';
import { CommonBtn } from 'component/CommonBtn';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as properties from 'utils/properties';
import AsyncStorage from '@react-native-community/async-storage';
import * as hooksMember from 'hooks/member';
import { useDispatch } from 'react-redux';
import * as mbrReducer from 'redux/reducers/mbrReducer';
import { ROUTES, STACK } from 'constants/routes';
import { clearPrincipal } from 'redux/reducers/authReducer';

/* ################################################################################################################
###################################################################################################################
###### 내 계정 정보
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Profile'>;
  route: RouteProp<StackParamList, 'Profile'>;
}

export const Profile = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const dispatch = useDispatch();

  const jwtToken = hooksMember.getJwtToken(); // 토큰
  const memberSeq = hooksMember.getMemberSeq(); // 회원번호

  const memberBase = hooksMember.getBase(); // 회원 기본정보

  const [nickname, setNickname] = React.useState<any>(memberBase.nickname);
  const [name, setName] = React.useState<any>(memberBase.name);
  const [gender, setGender] = React.useState<any>(memberBase.gender);
  const [age, setAge] = React.useState<any>(String(memberBase.age));
  const [phoneNumber, setPhoneNumber] = React.useState<any>(
    memberBase.phone_number
  );

  // 저장 버튼
  const btnSave = async () => {
    // 닉네임 변경 여부 체크
    if (memberBase.nickname == nickname) {
      navigation.navigate(STACK.TAB, {
        screen: 'Roby',
      });
    } else {
      setNicknameUpdatePopup(true);
    }
  };

	// 비밀번호 변경 버튼
	const btnChangePassword = async () => {
		navigation.navigate('ChangePassword', {});
	}
 
  // 내 계정 정보 저장
  const saveMemberBase = async () => {
    const result = await axios
      .post(
        properties.api_domain + '/member/saveMemberBase',
        {
          'api-key': 'U0FNR09CX1RPS0VOXzAx',
          member_seq: memberSeq,
          nickname: nickname,
          usePassYn: 'Y',
        },
        {
          headers: {
            'jwt-token': jwtToken,
          },
        }
      )
      .then(function (response) {
        console.log(
          'dasldkasm;ldams;ldkma; :::::: ',
          response.data.result_code
        );

        if (response.data.result_code == '0000') {
          setNicknameUpdatePopup(false);
          dispatch(
            mbrReducer.setBase(JSON.stringify(response.data.memberBase))
          );
          navigation.navigate('Main', {
            screen: 'Roby',
          });
        } else if (response.data.result_code == '6010') {
          setNicknameUpdatePopup(false);
          Alert.alert('알림', '보유 패스가 부족합니다.', [{ text: '확인' }]);
          return false;
        } else {
          setNicknameUpdatePopup(false);
          Alert.alert('알림', '시스템 오류입니다.\n관리자에게 문의해 주세요!', [
            { text: '확인' },
          ]);
          return false;
        }
      })
      .catch(function (error) {
        console.log('error ::: ', error);
      });
  };

  // ################### 팝업 관련 #####################
  const [nickNameUpdatePopup, setNicknameUpdatePopup] = React.useState(false); // 닉네임 변경 팝업

  const logout = async () => {
    // #todo pushtoken 비워줄 로그아웃 api
    await AsyncStorage.clear();
    dispatch(clearPrincipal());
    //#todo mbr base = > principal reducer
    // navigation.navigate(STACK.AUTH, { screen: ROUTES.LOGIN });
  };

  return (
    <>
      <CommonHeader title={'내 계정 정보'} />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { justifyContent: 'space-between' },
        ]}
      >
        <View>
          <SpaceView mb={24}>
            <CommonInput
              label={'닉네임'}
              placeholder=""
              value={nickname}
              onChangeText={(nickname) => setNickname(nickname)}
              rightPen={true}
            />
          </SpaceView>
          <SpaceView mb={24}>
            <CommonInput
              label={'이름'}
              placeholder=""
              value={name}
              disabled={true}
            />
          </SpaceView>

          <SpaceView mb={24} viewStyle={styles.halfContainer}>
            <View style={styles.halfItemLeft}>
              <CommonInput
                label={'성별'}
                placeholder=""
                value={gender == 'M' ? '남자' : '여자'}
                disabled={true}
              />
            </View>

            <View style={styles.halfItemRight}>
              <CommonInput
                label={'나이'}
                placeholder=""
                value={age}
                disabled={true}
              />
            </View>
          </SpaceView>

          {/* <SpaceView mb={24}>
					<CommonInput 
						label={'회사명'} 
						placeholder="" />
				</SpaceView> */}

          {/* <SpaceView mb={24}>
					<CommonInput label={'계정 ID'} placeholder="heighten@kakao.com" rightPen={true} />
				</SpaceView> */}

          <SpaceView mb={24}>
            <CommonInput
              label={'전화번호'}
              placeholder=""
              value={phoneNumber}
              disabled={true}
            />
          </SpaceView>
        </View>

        <SpaceView mb={16}>
          <CommonBtn value={'로그아웃'} type={'primary'} onPress={logout} />
          {/* <View style={{ height: 6 }} />
          <CommonBtn value={'비밀번호 변경'} type={'primary'} onPress={btnChangePassword} /> */}
          <View style={{ height: 6 }} />
          <CommonBtn value={'저장'} type={'primary'} onPress={btnSave} />
        </SpaceView>
      </ScrollView>

      {/* ###############################################
                        닉네임 변경 팝업
            ############################################### */}
      <Modal visible={nickNameUpdatePopup} transparent={true}>
        <View style={modalStyle.modalBackground}>
          <View style={modalStyle.modalStyle1}>
            <SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
              <CommonText fontWeight={'700'} type={'h4'}>
                닉네임 변경
              </CommonText>
            </SpaceView>

            <SpaceView viewStyle={layoutStyle.alignCenter}>
              <CommonText type={'h5'}>닉네임을 변경하시겠습니까?</CommonText>
              <CommonText type={'h5'} color={ColorType.red}>
                패스 x5
              </CommonText>
            </SpaceView>

            <View style={modalStyle.modalBtnContainer}>
              <TouchableOpacity
                style={modalStyle.modalBtn}
                onPress={() => setNicknameUpdatePopup(false)}
              >
                <CommonText fontWeight={'500'}>취소</CommonText>
              </TouchableOpacity>
              <View style={modalStyle.modalBtnline} />
              <TouchableOpacity
                style={modalStyle.modalBtn}
                onPress={() => saveMemberBase()}
              >
                <CommonText fontWeight={'500'} color={ColorType.red}>
                  확인
                </CommonText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
