import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { useHttp } from '../../hooks/http.hook'


const heroesAtapter = createEntityAdapter()
const initialState = heroesAtapter.getInitialState({
  heroesLoadingStatus: 'idle'
})

export const fetchHeroes = createAsyncThunk('heroes/fetchHeroes', () => {
  const { request } = useHttp()
  return request('http://localhost:3001/heroes')
})

const heroesSlice = createSlice({
  name: 'heroes',
  initialState,
  reducers: {
    heroCreated: (state, action) => {
      heroesAtapter.addOne(state, action.payload)
    },
    heroDeleted: (state, action) => {
      heroesAtapter.removeOne(state, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroes.pending, (state) => {
        state.heroesLoadingStatus = 'loading'
      })
      .addCase(fetchHeroes.fulfilled, (state, action) => {
        state.heroesLoadingStatus = 'idle'
        heroesAtapter.setAll(state,  action.payload)
      })
      .addCase(fetchHeroes.rejected, (state) => {
        state.heroesLoadingStatus = 'error'
      })
      .addDefaultCase(() => {})
  },
})

const { actions, reducer } = heroesSlice


const {selectAll} = heroesAtapter.getSelectors(state => state.heroes)
export const filteredHeroesSelector = createSelector(
  (state) => state.filters.activeFilter,
  selectAll,
  (filter, heroes) => {
    if (filter === 'all') {
      return heroes
    } else {
      return heroes.filter((item) => item.element === filter)
    }
  }
)

export default reducer
export const {
  heroesFetching,
  heroesFetched,
  heroesFetchingError,
  heroCreated,
  heroDeleted,
} = actions
