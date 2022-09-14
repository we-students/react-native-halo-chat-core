/* eslint-disable @typescript-eslint/no-explicit-any */
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'

interface ScreenProps<RouteType = any> extends StackScreenProps<any, any> {
    navigation: StackNavigationProp<any, any>
    route: RouteType
}
