import journal from './meta/_journal.json'
import m0000 from './0000_create_operations.sql'
import m0001 from './0001_adjustment_target_balance.sql'

export default {
  journal,
  migrations: {
    m0000,
    m0001
  }
}
