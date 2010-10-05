COMPONENTS = {
    
    "Core" : [
        "KiokuJS.Reference",
        
        "KiokuJS.Exception",
        "KiokuJS.Exception.Network",
        "KiokuJS.Exception.Format",
        "KiokuJS.Exception.Overwrite",
        "KiokuJS.Exception.Update",
        "KiokuJS.Exception.Remove",
        "KiokuJS.Exception.LookUp",
        "KiokuJS.Exception.Conflict",
        
        "KiokuJS.Aspect.AfterCollapse",
        "KiokuJS.Aspect.AfterExpand",
        
        "KiokuJS.Feature.Attribute.Intrinsic",
        "KiokuJS.Feature.Attribute.Extrinsic",
        "KiokuJS.Feature.Attribute.Skip",
        "KiokuJS.Feature.Attribute.Proxy",
        "KiokuJS.Feature.Attribute.Lazy",
        
        "KiokuJS.Feature.Class.Intrinsic",
        
        "KiokuJS.Feature.Class.OwnID",
        "KiokuJS.Feature.Class.OwnUUID",
        "KiokuJS.Feature.Class.Immutable",
        
        "KiokuJS.Role.Serializer",
        "KiokuJS.Serializer.JSON",
        
        "KiokuJS.TypeMap.Role.NoDeps",
        
        "KiokuJS.TypeMap",
        "KiokuJS.TypeMap.Date",
        "KiokuJS.TypeMap.Function",
        "KiokuJS.TypeMap.Array",
        "KiokuJS.TypeMap.Object",
        "KiokuJS.TypeMap.Joose",
        
        "KiokuJS.Resolver",
        "KiokuJS.Resolver.Standard",
        
        "KiokuJS.Role.Resolvable",
        
        "KiokuJS.Node",
        
        "KiokuJS.Collapser.Encoder",
        "KiokuJS.Linker.Decoder",
        
        "KiokuJS.Linker.RefGatherer",
        "KiokuJS.Linker.Expander",
        
        "KiokuJS.Backend.Role.SkipFixture",
        "KiokuJS.Backend.Feature.Overwrite",
        "KiokuJS.Backend.Feature.Update",
        
        "KiokuJS.Backend",
        "KiokuJS.Backend.Hash",
        
        
        "KiokuJS.Collapser",
        "KiokuJS.Linker",
        
        "KiokuJS.Scope",
        "KiokuJS"
    ],
    
    
    "Test" : [
        "+Core",
        
        "KiokuJS.Test.Person",
        "KiokuJS.Test.Person.Hobby",
        "KiokuJS.Test.Vertex",
        
        "KiokuJS.Test.Fixture",
        "KiokuJS.Test.Fixture.ObjectGraph",
        "KiokuJS.Test.Fixture.Update",
        "KiokuJS.Test.Fixture.Remove",
        "KiokuJS.Test.Fixture.Refresh",
        "KiokuJS.Test.Fixture.Traits",
        "KiokuJS.Test.Fixture.Intrinsic",
        "KiokuJS.Test.Fixture.Immutable",
        "KiokuJS.Test.Fixture.Proxy",
        "KiokuJS.Test.Fixture.AnimatePacket",
        "KiokuJS.Test.Fixture.Lazy",
        
        "KiokuJS.Test.Fixture.BackendFeature.Overwrite",
        
        "KiokuJS.Test.Fixture.StressLoad.Tree",
        
        "KiokuJS.Test"
    ],
    
    
    "Prereq" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Attribute.Bootstrap",
        "jsan:Task.JooseX.Namespace.Depended.Auto",
        "jsan:Task.JooseX.CPS.All",
        
        "jsan:Data.UUID",
        "jsan:Data.Visitor",
        "jsan:Task.JSON2.Bundle"
    ],
    
    
    "WebPrereq" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Attribute.Bootstrap",
        
        "jsan:JooseX.SimpleRequest",
        "jsan:Task.JooseX.Namespace.Depended.Web",
        
        "jsan:Task.JooseX.CPS.All",
        "jsan:Data.UUID",
        "jsan:Data.Visitor",
        "jsan:Task.JSON2.Bundle"
    ],
    
    
    "NodeJSPrereq" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Attribute.Bootstrap",
        
        "jsan:Task.JooseX.Namespace.Depended.NodeJS",
        
        "jsan:Task.JooseX.CPS.All",
        "jsan:Data.UUID",
        "jsan:Data.Visitor",
        "jsan:Task.JSON2.Bundle"
    ]
} 

