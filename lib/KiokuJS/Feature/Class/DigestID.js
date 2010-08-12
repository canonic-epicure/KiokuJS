Role('KiokuJS.Feature.Class.DigestID', {
    
    does : [ 'KiokuJS.Feature.Class.OwnID', 'KiokuJS.Feature.Class.Immutable' ],
    
    
    requires : [ 'getDigest' ],
    
    
    methods : {
        
        hashDigest : function (string) {
            //TODO return md5 or sha1 for `string`
        },
        
        
        acquireID : function (node) {
            
            return this.hashDigest(this.getDigest(node))
        }
    }
})
