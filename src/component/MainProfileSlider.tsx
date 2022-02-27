import * as React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import SpaceView from './SpaceView';
import Carousel from 'react-native-snap-carousel';
import { useState } from 'react';
import { ICON } from 'utils/imageUtils';
import { CommonText } from './CommonText';
import { ColorType } from '@types';
import { layoutStyle } from 'assets/styles/Styles';
import { Color } from 'assets/styles/Color';
import { BarGrap } from './BarGrap';
import { ToolTip } from './Tooltip';

const { width } = Dimensions.get('window');
interface DataType {
	item: number;
}

interface Props {
	isOnlyProfileItem?: boolean;
	item?: DataType;
	index?: number;
}
/**
 *
 * 프로파일 슬라이더
 */
export const MainProfileSlider = () => {
	const [data] = useState<DataType[]>([
		{ item: 1 },
		{ item: 1 },
		{ item: 1 },
		{ item: 1 },
		{ item: 1 },
		{ item: 1 },
	]);

	return (
		<Carousel
			data={data}
			renderItem={ProfileItem}
			sliderWidth={width}
			itemWidth={width - 54}
			inactiveSlideScale={0.93}
			inactiveSlideOpacity={1}
		/>
	);
};

/**
 * 프로파일 슬라이더 아이템
 * @param {boolean} isOnlyProfileItem 아이템만 필요할 경우 사용
 * @returns
 */
export const ProfileItem = (props: Props) => {
	const { isOnlyProfileItem } = props;
	return (
		<View style={[styles.profileContainer, isOnlyProfileItem && { left: 0 }]}>
			<SpaceView mb={8} viewStyle={layoutStyle.alignCenter}>
				<Image source={ICON.party} style={styles.iconSize} />
			</SpaceView>

			<SpaceView viewStyle={layoutStyle.alignCenter} mb={29}>
				<CommonText color={ColorType.gray8888} textStyle={styles.textCenter}>
					이성들에게
					<CommonText color={ColorType.purple}>선호도가</CommonText>
					{'\n'}
					<CommonText color={ColorType.purple}>매우 높은 회원</CommonText>과 매칭되셨네요!
				</CommonText>
			</SpaceView>

			<SpaceView viewStyle={layoutStyle.rowBetween} mb={29}>
				<ToolTip title={'프로필 평점'} desc={'프로필 평점에 대한 툴팁'} />

				<View>
					<CommonText type={'h2'}>7.5</CommonText>
				</View>
			</SpaceView>
			<BarGrap score={7.5} />
		</View>
	);
};

const styles = StyleSheet.create({
	profileContainer: {
		height: 270,
		backgroundColor: Color.grayF8F8,
		borderRadius: 16,
		left: -27,
		padding: 24,
	},
	iconSize: {
		width: 48,
		height: 48,
	},
	textCenter: { textAlign: 'center' },
});
