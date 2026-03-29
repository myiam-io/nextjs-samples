import { myiam } from '@/lib/myiam'
import { requireSession } from '@/lib/auth'
import { MyiamApiError, type PrepareActionType } from '@myiam.io/web-sdk/server'
import { NextResponse, type NextRequest } from 'next/server'

type RouteContext = { params: Promise<{ path: string[] }> }

function getPath(params: { path: string[] }) {
  return params.path.join('/')
}

function errorResponse(err: unknown) {
  if (err instanceof MyiamApiError) {
    return NextResponse.json(
      { status: err.status, code: err.code, message: err.message },
      { status: err.status },
    )
  }
  return NextResponse.json({ error: String(err) }, { status: 500 })
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

function requireParam(searchParams: URLSearchParams, name: string) {
  const value = searchParams.get(name)
  if (!value) throw badRequest(`${name}가 필요합니다.`)
  return value
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { session, error } = await requireSession()
  if (error) return error

  const path = getPath(await params)

  try {
    switch (path) {
      case 'token/info':
        return NextResponse.json(
          await myiam.api.getTokenInfo(session.accessToken),
        )

      case 'user/me':
        return NextResponse.json(
          await myiam.api.getUser({ accessToken: session.accessToken }),
        )

      case 'user/service': {
        const serviceUserUid = requireParam(request.nextUrl.searchParams, 'serviceUserUid')
        return NextResponse.json(
          await myiam.api.getServiceUser({ accessToken: session.accessToken, serviceUserUid }),
        )
      }

      case 'user/profile': {
        const serviceUserUid = requireParam(request.nextUrl.searchParams, 'serviceUserUid')
        return NextResponse.json(
          await myiam.api.getServiceUserProfile({ accessToken: session.accessToken, serviceUserUid }),
        )
      }

      default:
        return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }
  } catch (err) {
    return err instanceof NextResponse ? err : errorResponse(err)
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const path = getPath(await params)

  try {
    switch (path) {
      case 'user/action': {
        const { session, error } = await requireSession()
        if (error) return error
        const { type, serviceUserUid, completeRedirectUrl, state, editParams } =
          await request.json()
        if (!type || !serviceUserUid || !completeRedirectUrl) {
          return badRequest('type, serviceUserUid, completeRedirectUrl은 필수입니다.')
        }
        return NextResponse.json(
          await myiam.api.prepareUserAction(type as PrepareActionType, {
            accessToken: session.accessToken,
            serviceUserUid,
            completeRedirectUrl,
            state,
            editParams,
          }),
        )
      }
      default:
        return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }
  } catch (err) {
    return err instanceof NextResponse ? err : errorResponse(err)
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const path = getPath(await params)
  if (path !== 'token') {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  const { session, error } = await requireSession()
  if (error) return error

  try {
    const body = await request.json().catch(() => ({}))
    const { serviceUserUid, target, refreshTokenDelete } = body as {
      serviceUserUid?: string
      target?: 'ACCOUNT_USER' | 'SERVICE'
      refreshTokenDelete?: boolean
    }
    await myiam.api.deleteToken({
      accessToken: session.accessToken,
      serviceUserUid,
      target,
      refreshTokenDelete,
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    return errorResponse(err)
  }
}
