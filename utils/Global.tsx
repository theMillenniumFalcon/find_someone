import { Platform, ToastAndroid } from 'react-native'
import axios, { AxiosResponse } from 'axios'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createNavigationContainerRef } from '@react-navigation/native'
import Toast from 'react-native-root-toast'

import * as URL from "./URL"
import { ConversationDto, UserDto } from "../types/types"

export const FLAG_ENABLE_DONATION = true

export const navigationRef = createNavigationContainerRef()
export const INDEX_REGISTER = "1"
export const INDEX_ONBOARDING = "2"
export const INDEX_MAIN = "3"

export const STORAGE_FIRSTNAME = "firstName"
export const STORAGE_PAGE = "page"
export const STORAGE_YOUR_PROFILE = "your-profile"
export const STORAGE_YOUR_CHAT = "chat"
export const STORAGE_YOUR_CHAT_DETAIL = "chat/%s"
export const STORAGE_LIKES = "likes"
export const STORAGE_DONATE = "donate"
export const STORAGE_LATITUDE = "latitude"
export const STORAGE_LONGITUDE = "longitude"

export async function Fetch(url: string = "", method: string = "get", data: any = undefined,
    contentType: string = "application/json"): Promise<AxiosResponse<any, any>> {
    try {
        let res = await axios({
            withCredentials: true,
            method: method,
            url: url,
            headers: {
                'Content-Type': contentType
            },
            data: data,

        })
        if (res.request.responseURL == URL.AUTH_LOGIN) {
            navigate("Login")
            throw new Error("Not authenticated")
        }
        return res
    } catch (e) {
        throw e
    }
}

export function nagivateProfile(user?: UserDto, idEnc?: string) {
    navigate("Profile", {
        user: user,
        idEnc: idEnc
    })
}

export function nagivateChatDetails(conversation: ConversationDto) {
    navigate("MessageDetail", {
        conversation: conversation
    })
}

export function navigate(name: string, params?: any) {
    if (navigationRef.isReady()) {
        navigationRef.navigate((name) as never, (params) as never)
    }
}

export async function GetStorage(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(key)
    } else {
        return await SecureStore.getItemAsync(key)
    }
}

export async function SetStorage(key: string, value: string) {
    if (Platform.OS === 'web') {
        await AsyncStorage.setItem(key, value)
    } else {
        await SecureStore.setItemAsync(key, value)
    }
}

export function loadPage(page: string = INDEX_REGISTER) {
    if (INDEX_ONBOARDING == page) {
        navigate("Onboarding")
    } else if (INDEX_MAIN == page) {
        navigate("Main")
    } else {
        navigate("Register")
    }
}

export function ShowToast(text: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(text, ToastAndroid.LONG)
    } else {
        Toast.show(text, {
            duration: Toast.durations.LONG,
            backgroundColor: "#424242"
        })
    }
}

export function isEmailValid(text: string) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    return reg.test(text)
}

export function isPasswordSecure(password: string) {
    const minPasswordLength = 7
    if (password.length < minPasswordLength) {
        return false
    } else if (password.match(/[a-z]/i) && password.match(/[0-9]+/)) {
        return true
    } else {
        return false
    }
}

export const format = (str: string, ...args: any[]) => args.reduce((s, v) => s.replace('%s', v), str)