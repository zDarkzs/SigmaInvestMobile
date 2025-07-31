import {Platform, View} from 'react-native';
import {BannerAd, BannerAdSize, TestIds} from "react-native-google-mobile-ads";

export default function AdBanner() {
  const isPremiumUser = false;
  if (isPremiumUser || Platform.OS === "web"){
    return (
      <View></View>
    )
  }
  return (
    <View>
      <BannerAd
        unitId={__DEV__? TestIds.BANNER: 'ca-app-pub-5675257971208612~4110605516'}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.error('Ad failed to load: ', error);
        }}
      />

    </View>
  )
}